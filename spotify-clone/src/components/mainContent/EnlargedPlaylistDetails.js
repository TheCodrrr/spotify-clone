const client_id = 'fa99f1012dea4fa292a3b9a593e5fd19';
const client_secret = '909967f80ec44c33b1738a2e09edbe5d';
const refresh_token = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA";

async function getAccessToken() {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      })
    });
    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
}

async function getSongDetails(songName) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.error("Access token is required to fetch song details.");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track&limit=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      console.error(`Error fetching song details: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (!data.tracks || data.tracks.items.length === 0) {
      // console.log(`No song found for "${songName}"`);
      return null;
    }

    const song = data.tracks.items[0]; // Get the first matching song
    return {
      song_name: song.name,
      song_album: song.album.name,
      album_image: song.album.images[0]?.url || '', // Album artwork
      song_artists: song.artists.map(artist => artist.name).join(', '), // Artist names
      release_date: song.album.release_date,
      song_length_ms: song.duration_ms,
      song_length_min: Math.floor(song.duration_ms / 60000),
      song_length_sec: Math.floor((song.duration_ms % 60000) / 1000),
      external_url: song.external_urls.spotify // Spotify link to the song
    };
  } catch (error) {
    console.error('Error occurred while fetching song details:', error);
    return null;
  }
}

async function fetchPlaylistSongs(accessToken, playlistId) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
    const data = await response.json();
    if (!data.items) return [];

    return data.items.map((item) => ({
      song_image: item.track.album.images[0]?.url || '', // Optional song image
      song_name: item.track.name,
      song_singers: item.track.artists.map(artist => artist.name).join(', '),
      song_album: item.track.album.name,
      date_added: item.added_at.split('T')[0],
      song_length_min: Math.floor(item.track.duration_ms / 60000),
      song_length_sec: Math.floor((item.track.duration_ms % 60000) / 1000),
    }));
  } catch (error) {
    console.error(`Error fetching songs for playlist ${playlistId}:`, error);
    return [];
  }
}

export async function getAllPlaylistsWithSongs() {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    });
    const playlistsData = await playlistsResponse.json();

    if (!playlistsData.items) return [];

    const playlistDetails = [];
    for (const playlist of playlistsData.items) {
      try {
        // console.log(`Fetching songs for playlist: ${playlist.name} with ID ${playlist.id}`);
        const songs = await fetchPlaylistSongs(accessToken, playlist.id);

        const totalPlaytimeSec = songs.reduce(
          (acc, song) => acc + song.song_length_min * 60 + song.song_length_sec,
          
        );

        playlistDetails.push({
          content_type: 'playlist',
          playlist_name: playlist.name,
          main_image: playlist.images?.[0]?.url || '', // Check if images array exists and has at least one item
          playlist_owner_image: playlist.owner?.images?.[0]?.url || '', // Check if owner and images exist
          playlist_owner: playlist.owner?.display_name || 'Unknown', // Fallback to 'Unknown' if display_name is missing
          playlist_saves: playlist.followers?.total || 0,
          no_of_songs: playlist.tracks.total,
          total_playtime_hr: Math.floor(songs.reduce((acc, song) => acc + song.song_length_min, 0) / 60),
          total_playtime_min: songs.reduce((acc, song) => acc + song.song_length_min, 0) % 60,
          total_playtime_sec: totalPlaytimeSec, // Added total playtime in seconds
          songs: songs
        });
      } catch (error) {
        console.error(`Error fetching songs for playlist ${playlist.name}:`, error);
      }
    }

    return playlistDetails;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
}

export { getSongDetails };