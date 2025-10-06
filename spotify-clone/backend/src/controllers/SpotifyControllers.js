import getAccessToken from "../../utils/spotifyAuth.js";
import cache from "../../utils/cache.js";
import fetch from "node-fetch";
import axios from "axios";
import * as cheerio from "cheerio";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches 100 random playlists or podcasts from multiple genres.
 */
async function fetchRandomPlaylistsOrPodcasts(_, res) {
    const now = Date.now();

    if (cache.playlistsCache && cache.cacheTimestamp && (now - cache.cacheTimestamp < 10 * 60 * 1000)) {
        // console.log("✅ Using cached playlists/podcasts data");
        return res.status(200).json(cache.playlistsCache);
    }

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) throw new Error('⚠️ Failed to obtain access token');

        const genres = ["pop", "rock", "jazz", "hip-hop", "electronic", "classical", "reggae", "indie", "blues", "metal", "country", "funk", "folk", "punk", "r&b", "lofi"];
        const queryTerms = ["best", "top", "chill", "trending", "new", "vibe"];

        // Select 5 random genres to fetch from
        const selectedGenres = [];
        while (selectedGenres.length < 5) {
            const randomGenre = genres[Math.floor(Math.random() * genres.length)];
            if (!selectedGenres.includes(randomGenre)) {
                selectedGenres.push(randomGenre);
            }
        }

        // Fetch 20 results per genre (10 playlists + 10 podcasts)
        const requests = selectedGenres.flatMap(genre => {
            const randomQuery = queryTerms[Math.floor(Math.random() * queryTerms.length)];
            const searchQuery = `${randomQuery} ${genre}`;

            return [0, 10].map(offset =>
                fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=playlist,show&limit=10&offset=${offset}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }).then(response => response.json())
            );
        });

        const responses = await Promise.all(requests);
        let results = [];

        for (const data of responses) {
            if (data.error) {
                console.error(`❌ Spotify API Error: ${data.error.message}`);
                continue; // Skip this response if an error occurred
            }

            if (data.playlists?.items) {
                results = results.concat(
                    data.playlists.items
                        .filter(playlist => playlist && playlist.id) // ✅ Filter out null/undefined
                        .map(playlist => ({
                            id: playlist.id,
                            name: playlist.name,
                            description: playlist.description || "No description available",
                            image: playlist.images?.[0]?.url || null,
                            total_songs: playlist.tracks?.total || 0,
                            spotifyUrl: playlist.external_urls?.spotify || null,
                            genre: playlist.name.toLowerCase().includes("lofi") ? "lofi" : "mixed",
                            type: "playlist"
                        }))
                );
            }

            if (data.shows?.items) {
                results = results.concat(
                    data.shows.items
                        .filter(show => show && show.id) // ✅ Filter out null/undefined
                        .map(show => ({
                            id: show.id,
                            name: show.name,
                            description: show.description || "No description available",
                            image: show.images?.[0]?.url || null,
                            total_songs: show.total_episodes || 0,
                            spotifyUrl: show.external_urls?.spotify || null,
                            genre: show.name.toLowerCase().includes("lofi") ? "lofi" : "mixed",
                            type: "podcast"
                        }))
                );
            }
        }

        // Ensure exactly 100 unique results (removes duplicates)
        const uniqueResults = Array.from(new Map(results.map(item => [item.id, item])).values()).slice(0, 100);

        cache.playlistsCache = uniqueResults;
        cache.cacheTimestamp = now;

        // return uniqueResults;
        if (uniqueResults) return res.status(200).json(uniqueResults);
        res.status(400).json({ error: "Error while fetching random playlists" });
    } catch (error) {
        console.error(`❌ Error fetching playlists or podcasts: ${error.message}`);
        return res.status(500).json({ error: "Error fetching playlists or podcasts" });
    }
}


// Current the below 2 codes aren't used anywhere in the codebase in frontend

// Function to fetch playlists or other data from Spotify API
const fetchFromSpotify = async (endpoint, accessToken) => {
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return response.json();
};

const getSectionsAndPlaylists = async (_, res) => {
    const accessToken = await getAccessToken();
    const sections = {};

    try {
        const userPlaylists = await fetchFromSpotify('/me/playlists', accessToken);
        sections['Your Playlists'] = userPlaylists.items?.map(playlist => ({
            name: playlist.name,
            id: playlist.id,
            uri: playlist.uri
        })) || [];

        const featured = await fetchFromSpotify('/browse/featured-playlists', accessToken);
        sections['Featured Playlists'] = featured.playlists?.items?.map(playlist => ({
            name: playlist.name,
            id: playlist.id,
            uri: playlist.uri
        })) || [];

        const recentlyPlayed = await fetchFromSpotify('/me/player/recently-played', accessToken);
        sections['Recently Played'] = recentlyPlayed.items?.map(item => ({
            name: item.track.name,
            artist: item.track.artists.map(artist => artist.name).join(', '),
            uri: item.track.uri
        })) || [];

        const categories = await fetchFromSpotify('/browse/categories', accessToken);
        sections['Categories'] = categories.categories?.items?.map(category => ({
            name: category.name,
            id: category.id
        })) || [];

    } catch (error) {
        console.error('Error fetching section:', error);
    }

    res.status(200).json(sections);
};

// Function to fetch user playlists
async function fetchUserPlaylists(_, res) {
    if (cache.cachedPlaylists) {
        // console.log("Using cached playlists.");
        return res.status(200).json(cache.cachedPlaylists);
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
        // console.log("Unable to fetch access token.");
        return res.status(401).json({ error: "Unable to fetch access token" });
    }

    try {
        await delay(1000); // 1-second delay

        const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        const rateLimitReset = response.headers.get('X-RateLimit-Reset');
        const currentTime = Math.floor(Date.now() / 1000);

        if (rateLimitRemaining === '0' && rateLimitReset) {
            const waitTime = parseInt(rateLimitReset, 10) - currentTime;
            if (waitTime > 0) {
                console.warn(`Rate limit hit. Waiting ${waitTime}s to retry.`);
                await delay(waitTime * 1000);
                return fetchUserPlaylists(); // Retry after delay
            }
        }

        const data = await response.json();

        if (!response.ok) {
            console.error('Error fetching playlists:', data);
            return res.status(400).json([]);
        }

        const userPlaylists = data?.items?.filter(
            playlist => playlist?.owner?.id !== 'spotify'
        ) || [];

        cache.cachedPlaylists = userPlaylists.map(playlist => ({
            user_playlist_image: playlist?.images?.[0]?.url || 'No image available',
            user_playlist_name: playlist?.name || 'Unnamed Playlist',
            user_playlist_id: playlist?.id || 'No ID available',
            user_playlist_link: playlist?.external_urls?.spotify || 'No link available',
            user_playlist_track_count: playlist?.tracks?.total || 0,
            user_playlist_owner: playlist?.owner?.display_name || 'Unknown Owner',
        }));

        // console.log("Playlists fetched and cached:", cache.cachedPlaylists);

        // return cache.cachedPlaylists;
        return res.status(200).json(cache.cachedPlaylists);

    } catch (error) {
        console.error('Error fetching playlists:', error);
        return res.status(500).json([]);
    }
}

// Function to load user details and fetch playlists
// const loadUserDetails = async () => {
//     const userPlaylistDetails = await fetchUserPlaylists();
//     return userPlaylistDetails;
// };

// Function to fetch the currently playing track
const getCurrentlyPlayingTrack = async (accessToken) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data?.item?.id;  // Returns the ID of the currently playing song
};

// Function to fetch and cache playlists from Spotify
const fetchPlaylists = async (_, res) => {
    if (cache.cachedPlaylists2) {
        // console.log('Returning cached playlists');
        return res.status(200).json(cache.cachedPlaylists2);
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
        // console.log("Unable to fetch access token.");
        return res.status(401).json({ error: "Unable to fetch access token" });
    }

    try {
        // Fetch playlists from Spotify API
        const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        // Check for errors in the response
        if (!response.ok) {
            console.error('Error fetching playlists:', data);
            return res.status(400).json({ error: "Error fetching playlists" });
        }

        // Fetch currently playing track
        const currentlyPlayingTrackId = await getCurrentlyPlayingTrack(accessToken);

        // Map the playlist data to the required format
        const formattedPlaylists = data.items.map(playlist => {
            const pinnedPlaylists = []; // Default empty array for pinned playlists
            const isPinned = pinnedPlaylists.includes(playlist.id);

            // Ensure the playlist has tracks before attempting to check if a track is from the playlist
            const playlistTracks = playlist.tracks?.items || [];

            // Ensure currentlyPlayingTrackId is valid before checking if it's in the playlist
            const isLastActive = currentlyPlayingTrackId && playlistTracks.some(track => track.id === currentlyPlayingTrackId);
            const isPlaying = currentlyPlayingTrackId && playlistTracks.some(track => track.id === currentlyPlayingTrackId);

            // console.log(`Playlist: ${playlist.name}, isLastActive: ${isLastActive}, isPlaying: ${isPlaying}`);

            return {
                card_image: playlist.images[0]?.url || 'No image available',
                card_name: playlist.name,
                card_type: 'Playlist',
                is_card_pinned: isPinned, // Check if playlist is pinned
                card_elm_count: playlist.tracks.total,
                card_owner: playlist.owner.display_name,
                is_last_active: isLastActive, // Set if last played song is from this playlist
                is_playing: isPlaying, // Set if a song from this playlist is currently playing
            };
        });

        // Cache the playlists to avoid multiple requests
        cache.cachedPlaylists2 = formattedPlaylists;

        // Return the formatted playlists
        // return formattedPlaylists;
        return res.status(200).json(formattedPlaylists);

    } catch (error) {
        console.error('Error fetching playlists:', error);
        return res.status(500).json({ error: "Error fetching playlists" });
    }
};

// fetchUserPlayedSong.js
async function fetchUserPlaylistsForRandomSong() {
    if (cache.cachedPlaylists3) {
        return cache.cachedPlaylists3;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) return;

    try {
        await delay(1000);
        const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Error fetching playlists:", data);
            return;
        }

        cache.cachedPlaylists3 = data.items.map(playlist => ({
            playlist_id: playlist.id,
            playlist_name: playlist.name,
            playlist_image: playlist.images[0]?.url || 'No image available',
            playlist_owner: playlist.owner.display_name,
            playlist_tracks_url: playlist.tracks.href,
        }));

        return cache.cachedPlaylists3;
    } catch (error) {
        console.error("Error fetching playlists:", error);
    }
}

// fetchUserPlayedSong.js
async function fetchArtistBio(artistName) {
    try {
        const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artistName)}`);
        const wikiData = await wikiResponse.json();

        return wikiData.extract || "No biography available.";
    } catch (error) {
        console.error(`Error fetching Wikipedia bio for ${artistName}:`, error);
        return "No biography available.";
    }
}

// fetchUserPlayedSong.js
async function fetchRandomSong(_, res) {
    if (!cache.cachedSongPromise) {
        cache.cachedSongPromise = (async () => {
            const playlists = await fetchUserPlaylistsForRandomSong();
            if (!playlists || playlists.length === 0) return;

            const accessToken = await getAccessToken();
            if (!accessToken) return;

            try {
                const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
                const tracksResponse = await fetch(randomPlaylist.playlist_tracks_url, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const tracksData = await tracksResponse.json();

                if (!tracksData.items || tracksData.items.length === 0) return;

                const randomTrack = tracksData.items[Math.floor(Math.random() * tracksData.items.length)].track;
                const mainArtistId = randomTrack.artists[0].id;
                const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${mainArtistId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const artistData = await artistResponse.json();
                const artistBio = await fetchArtistBio(artistData.name);

                const creditsResponse = await fetch(`https://api.spotify.com/v1/tracks/${randomTrack.id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const creditsData = await creditsResponse.json();

                const contributors = creditsData.artists.map(artist => ({
                    name: artist.name,
                    role: artist.id === mainArtistId ? "Main Artist" : "Contributor",
                    profile_url: artist.external_urls.spotify
                }));

                const detailedSong = {
                    song_id: randomTrack.id,  // Added song ID
                    song_name: randomTrack.name,
                    song_duration: randomTrack.duration_ms, // Added song duration
                    song_image: randomTrack.album.images[0]?.url || "No image available",
                    song_url: randomTrack.external_urls.spotify,
                    playlist_name: randomPlaylist.playlist_name,
                    playlist_owner: randomPlaylist.playlist_owner,
                    artists: randomTrack.artists.map(a => ({
                        name: a.name,
                        profile_url: a.external_urls.spotify
                    })),
                    main_artist: {
                        name: artistData.name,
                        bio: artistBio,
                        monthly_listeners: artistData.followers.total,
                        image: artistData.images[0]?.url || "No image available",
                        profile_url: artistData.external_urls.spotify
                    },
                    contributors: contributors
                };

                // console.log("Final Song Data:", detailedSong);
                return detailedSong;
            } catch (error) {
                console.error("Error fetching random song:", error);
            }
        })();
    }

    // return cache.cachedSongPromise;
    const result = await cache.cachedSongPromise;
    return res.status(200).json(result);
}

// EnlargedBrowseDetails.js
const fetchCategoriesWithImages = async (_, res) => {
    // Check if cached data is available and still valid
    if (cache.categoriesCache.data && (Date.now() - cache.categoriesCache.timestamp) < cache.categoriesCache.expiryTime) {
        // console.log("Returning cached categories...");
        return res.status(200).json(cache.categoriesCache.data);
    }

    const accessToken = await getAccessToken(); // Fetch access token

    try {
        // Fetch categories
        const categoriesResponse = await fetch("https://api.spotify.com/v1/browse/categories?limit=25", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!categoriesResponse.ok) {
            throw new Error(`Error: ${categoriesResponse.status}`);
        }

        const categoriesData = await categoriesResponse.json();
        const categories = categoriesData.categories.items;

        // Fetch first playlist for each category to get a proper image
        const categoriesWithImages = await Promise.all(
            categories.map(async (category) => {
                const playlistResponse = await fetch(
                    `https://api.spotify.com/v1/browse/categories/${category.id}/playlists?limit=1`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const playlistData = await playlistResponse.json();
                const playlistImage = playlistData.playlists?.items[0]?.images[0]?.url || category.icons[0]?.url;

                return {
                    id: category.id,
                    name: category.name,
                    image: playlistImage // Using the playlist cover instead of category icon
                };
            })
        );

        // Store data in cache
        cache.categoriesCache = {
            data: categoriesWithImages,
            timestamp: Date.now()
        };

        // console.log("Fetched and cached categories.");
        // console.log(categoriesWithImages)
        // return categoriesWithImages;
        return res.status(200).json(categoriesWithImages);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return res.status(500).json({ error: "Failed to fetch categories" });
    }
};

// EnlargedPlaylistDetails.js
// async function getSongDetails(songName) {
async function getSongDetails(req, res) {
    const { songName } = req.body;
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.error("Access token is required to fetch song details.");
    return res.status(401).json(null);
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
      return res.status(response.status).json(null);
    }

    const data = await response.json();
    if (!data.tracks || data.tracks.items.length === 0) {
      // console.log(`No song found for "${songName}"`);
      return res.status(404).json(null);
    }

    const song = data.tracks.items[0]; // Get the first matching song

    // return {
    //   song_name: song.name,
    //   song_album: song.album.name,
    //   album_image: song.album.images[0]?.url || '', // Album artwork
    //   song_artists: song.artists.map(artist => artist.name).join(', '), // Artist names
    //   release_date: song.album.release_date,
    //   song_length_ms: song.duration_ms,
    //   song_length_min: Math.floor(song.duration_ms / 60000),
    //   song_length_sec: Math.floor((song.duration_ms % 60000) / 1000),
    //   external_url: song.external_urls.spotify // Spotify link to the song
    // }

    const finalData = {
      song_name: song.name,
      song_album: song.album.name,
      album_image: song.album.images[0]?.url || '', // Album artwork
      song_artists: song.artists.map(artist => artist.name).join(', '), // Artist names
      release_date: song.album.release_date,
      song_length_ms: song.duration_ms,
      song_length_min: Math.floor(song.duration_ms / 60000),
      song_length_sec: Math.floor((song.duration_ms % 60000) / 1000),
      external_url: song.external_urls.spotify // Spotify link to the song
    }
    return res.status(200).json(finalData);
  } catch (error) {
    console.error('Error occurred while fetching song details:', error);
    return res.status(500).json(null);
  }
}

// EnlargedPlaylistDetails.js
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

// EnlargedPlaylistDetails.js
async function getAllPlaylistsWithSongs(req, res) {
  const { page = 1, limit = 10, playlistName } = req.query;
  const accessToken = await getAccessToken();
  if (!accessToken) return res.status(401).json([]);

  try {
    // Check if we have cached playlist data
    const cacheKey = 'allPlaylistsWithSongs';
    if (!cache[cacheKey] || (Date.now() - cache[`${cacheKey}_timestamp`] > 10 * 60 * 1000)) {
      // Fetch and cache all playlists with songs
      const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      });
      const playlistsData = await playlistsResponse.json();

      if (!playlistsData.items) return res.status(400).json([]);

      const playlistDetails = [];
      for (const playlist of playlistsData.items) {
        try {
          // console.log(`Fetching songs for playlist: ${playlist.name} with ID ${playlist.id}`);
          const songs = await fetchPlaylistSongs(accessToken, playlist.id);

          const totalPlaytimeSec = songs.reduce(
            (acc, song) => acc + song.song_length_min * 60 + song.song_length_sec,
            0
          );

          playlistDetails.push({
            content_type: 'playlist',
            playlist_name: playlist.name,
            main_image: playlist.images?.[0]?.url || '', 
            playlist_owner_image: playlist.owner?.images?.[0]?.url || '', 
            playlist_owner: playlist.owner?.display_name || 'Unknown', 
            playlist_saves: playlist.followers?.total || 0,
            no_of_songs: playlist.tracks.total,
            total_playtime_hr: Math.floor(songs.reduce((acc, song) => acc + song.song_length_min, 0) / 60),
            total_playtime_min: songs.reduce((acc, song) => acc + song.song_length_min, 0) % 60,
            total_playtime_sec: totalPlaytimeSec, 
            songs: songs // Store all songs in cache
          });
        } catch (error) {
          console.error(`Error fetching songs for playlist ${playlist.name}:`, error);
        }
      }

      // Cache the complete data
      cache[cacheKey] = playlistDetails;
      cache[`${cacheKey}_timestamp`] = Date.now();
      console.log('✅ All playlists with songs cached');
    }

    // If no specific playlist is requested, return all playlists with basic info (no songs)
    if (!playlistName) {
      const playlistsWithoutSongs = cache[cacheKey].map(playlist => ({
        ...playlist,
        songs: [] // Don't send songs in general list
      }));
      return res.status(200).json(playlistsWithoutSongs);
    }

    // Find the specific playlist and paginate its songs
    const selectedPlaylist = cache[cacheKey].find(
      playlist => playlist.playlist_name === playlistName
    );

    if (!selectedPlaylist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedSongs = selectedPlaylist.songs.slice(startIndex, endIndex);

    // Prepare response with pagination info
    const response = {
      ...selectedPlaylist,
      songs: paginatedSongs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(selectedPlaylist.songs.length / limit),
        totalSongs: selectedPlaylist.songs.length,
        hasMore: endIndex < selectedPlaylist.songs.length,
        limit: parseInt(limit)
      }
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return res.status(500).json([]);
  }
}

// fetchPublicPlaylist.js
async function fetchAllTracks(playlist_id, accessToken) {
    let allTracks = [];
    let nextUrl = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=100`; // Fetch 100 at a time

    try {
        while (nextUrl) {
            const response = await fetch(nextUrl, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!response.ok) throw new Error("Failed to fetch playlist tracks");

            const data = await response.json();
            allTracks.push(...data.items); // Append fetched tracks
            nextUrl = data.next; // Update next page URL (if any), else null
        }
        return allTracks;
    } catch (error) {
        console.error("Error fetching all playlist tracks:", error);
        return [];
    }
}

// fetchPublicPlaylist.js
// async function fetchPublicPlaylist(playlist_id) {
async function fetchPublicPlaylist(req, res) {
    const { playlist_id } = req.params;
    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.error("Access token is required to fetch song details.");
        return res.status(401).json(null);
    }

    const baseUrl = `https://api.spotify.com/v1/playlists/${playlist_id}`;

    try {
        const response = await fetch(baseUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) throw new Error("Failed to fetch playlist details");

        const data = await response.json();

        // Fetch all songs (handles pagination)
        const tracks = await fetchAllTracks(playlist_id, accessToken);

        // Playlist details
        const playlistDetails = {
            type: data.type || "Unknown",
            name: data.name,
            image: data.images?.[0]?.url || null,
            total_saves: data.followers?.total || 0,
            owner: {
                name: data.owner?.display_name || "Unknown",
                image: data.owner?.images?.[0]?.url || null
            },
            total_songs: data.tracks?.total || 0,
            songs: tracks.map(trackItem => {
                const track = trackItem.track;
                if (!track) return null;

                return {
                    id: track.id || "Unknown",
                    name: track.name,
                    image: track.album?.images?.[0]?.url || null,
                    artists: track.artists.map(artist => artist.name),
                    album: track.album?.name || "Unknown",
                    date_added: trackItem.added_at || "Unknown",
                    duration_ms: track.duration_ms || 0
                };
            }).filter(song => song !== null) // Remove null values
        };

        // console.log(JSON.stringify(playlistDetails));

        // return playlistDetails;
        return res.status(200).json(playlistDetails);
    } catch (error) {
        console.error("Error fetching playlist details:", error);
        return res.status(500).json(null);
    }
}

// fetchSongDetails.js
async function fetchPlayCount(songName, artistName) {
    try {
        const url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=your_lastfm_api_key&artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(songName)}&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        return data?.track?.playcount || 0;
    } catch (error) {
        console.error("Error fetching play count:", error);
        return 0;
    }
}

const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

async function fetchLyrics(songName, artistName) {
  try {
    const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(songName + " " + artistName)}`;

    const response = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });

    if (!response.ok) {
      const text = await response.text();
    //   console.error(`Genius API error: ${response.status} - ${text}`);
      return "Lyrics not found";
    }

    const data = await response.json();
    const songPath = data.response.hits[0]?.result?.path;
    if (!songPath) return "Lyrics not found";

    // Scrape lyrics
    const lyricsPageUrl = `https://genius.com${songPath}`;
    const lyricsResponse = await axios.get(lyricsPageUrl);
    const $ = cheerio.load(lyricsResponse.data);
    const lyrics = $('div[data-lyrics-container="true"]').text().trim();

    return lyrics || "Lyrics not found";
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return "Lyrics not found";
  }
}



// fetchSongDetails.js
async function fetchSongDetails(req, res) {
    const { song_id } = req.params;
    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.error("Failed to fetch Spotify access token.");
        return res.status(401).json(null);
    }

    const songUrl = `https://api.spotify.com/v1/tracks/${song_id}`;
    try {
        const response = await fetch(songUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) throw new Error("Failed to fetch song details");

        const songData = await response.json();

        // Fetch album details
        const album = songData.album;
        const releaseYear = album.release_date.split('-')[0]; // Extract year
        const albumImage = album.images?.[0]?.url || null; // Get album cover image

        // Fetch artist details
        const artists = await Promise.all(
            songData.artists.map(async (artist) => {
                const artistResponse = await fetch(artist.href, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                if (!artistResponse.ok) return null;
                const artistData = await artistResponse.json();

                return {
                    name: artistData.name,
                    image: artistData.images?.[0]?.url || null
                };
            })
        );

        // Fetch play count (from last.fm API)
        const playCount = await fetchPlayCount(songData.name, artists[0]?.name);

        // Fetch lyrics from Genius API
        let lyrics = await fetchLyrics(songData.name, artists[0]?.name);
        lyrics = lyrics.replace(/([A-Z])/g, '\n$1'); // Add \n before every capital letter

        const songDetails = {
            name: songData.name,
            album: album.name,
            release_year: releaseYear,
            duration_ms: songData.duration_ms,
            album_image: albumImage, // Add album image to response
            total_play_count: playCount,
            lyrics: lyrics,
            artists: artists.filter(a => a !== null) // Remove null values
        };

        // console.log(songDetails);

        // return songDetails;
        return res.status(200).json(songDetails);
    } catch (error) {
        console.error("Error fetching song details:", error);
        return res.status(500).json(null);
    }
}

// searchResult.js
// Extract Songs
function extractSongs(tracks = [], listLength) {
    return tracks.slice(0, listLength).map(track => ({
        id: track.id,
        name: track.name,
        album: track.album?.name || "Unknown Album", // Added album name
        image: track.album?.images[0]?.url || "",
        artists: track.artists.map(artist => artist.name),
        duration: track.duration_ms,
        extractType: 'track'
    }));
}

// searchResult.js
// Extract Artists
function extractArtists(artists = [], listLength) {
    return artists.slice(0, listLength).map(artist => ({
        id: artist.id,
        name: artist.name,
        image: artist.images?.[0]?.url || "",
        type: artist.type,
        extractType: 'artist'  
    }));
}

// searchResult.js
// Extract Albums
function extractAlbums(albums = [], listLength) {
    return albums.slice(0, listLength).map(album => ({
        id: album.id,
        name: album.name,
        image: album.images?.[0]?.url || "",
        releaseYear: album.release_date.split("-")[0],
        artists: album.artists.map(artist => artist.name),
        extractType: 'album'  
    }));
}

// searchResult.js
// Extract Playlists
function extractPlaylists(playlists = [], listLength) {
    return playlists
        .filter(playlist => playlist !== null) // Remove null values
        .slice(0, listLength)
        .map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.images?.[0]?.url || "",
            creator: playlist.owner?.display_name || "Unknown"
        }));
}

// searchResult.js
// Extract Podcasts (Shows)
function extractPodcasts(podcasts = [], listLength) {
    return podcasts.slice(0, listLength).map(podcast => ({
        id: podcast.id,
        name: podcast.name,
        image: podcast.images?.[0]?.url || "",
        creator: podcast.publisher
    }));
}

// searchResult.js
// Extract Episodes
function extractEpisodes(episodes = [], listLength) {
    return episodes.slice(0, listLength).map(episode => {
        let episodeData = {
            id: episode.id,
            name: episode.name,
            image: episode.images?.[0]?.url || "",
            releaseDate: episode.release_date,
            duration: episode.duration_ms,
        };

        // Add description only if listLength is 50
        if (listLength > 4) {
            episodeData.description = episode.description || "";
        }

        return episodeData;
    });
}

// searchResult.js
// async function searchSpotify(query, searchType) {
async function searchSpotify(req, res) {
    const query = req.query.query;
    const searchType = req.query.type;

    const accessToken = await getAccessToken();
    
    if (!accessToken) {
        console.error("Failed to get access token");
        return res.status(401).json(null);
    }

    // console.log("Access Token:", accessToken);

    let url = "";
    if (!searchType) url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist,show,episode&limit=50`;
    else url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${searchType}&limit=50`

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const data = await response.json();

        if (!data) return res.status(400).json(null);

        let fetchedData;
        if (!searchType) {
            fetchedData = {
                songs: extractSongs(data.tracks?.items || [], 4),
                artists: extractArtists(data.artists?.items || [], 4),
                albums: extractAlbums(data.albums?.items || [], 4),
                playlists: extractPlaylists(data.playlists?.items || [], 4),
                podcasts: extractPodcasts(data.shows?.items || [], 4),
                episodes: extractEpisodes(data.episodes?.items || [], 4),
            };
        }
        else {
            let fetchNumber = [6, 7, 8][Math.floor(Math.random() * 3)];
            fetchedData = searchType === "track" ? extractSongs(data.tracks?.items || [], 50) : searchType === "playlist" ? extractPlaylists(data.playlists?.items || [], 50) : searchType === "album" ? extractAlbums(data.albums?.items || [], 50) : searchType === "artist" ? extractArtists(data.artists?.items || [], 50) : searchType === "show,episode" ? extractPodcasts(data.shows?.items || [], 50).concat(extractEpisodes(data.episodes?.items || [], 50)) : searchType === "track,album" ? extractSongs(data.tracks?.items || [], fetchNumber).concat(extractAlbums(data.albums?.items || [], 10 - fetchNumber)) : null;
        }


        // console.log("Formatted Categories:", fetchedData);  // 🔍 Debugging the extracted results
        // console.log("Formatted Categories Length:", fetchedData.length);  // 🔍 Debugging the extracted results

        // return fetchedData;
        return res.status(200).json(fetchedData);
    } catch (error) {
        console.error("Error searching Spotify:", error);
        return res.status(500).json(null);
    }
}

// fetchRandomPlaylistsOrPodcasts().then(val => {
//     console.log(val);
// })
// fetchPlaylists().then(val => console.log(val));
// loadUserDetails().then(val => console.log(val));
// fetchRandomSong().then(val => console.log(val));
// fetchCategoriesWithImages().then(val => console.log(val));
// getSongDetails('dhun').then(val => console.log(val));
// getAllPlaylistsWithSongs().then(val => console.log(val));
// fetchPublicPlaylist('0N3GW3dwHypqcvfcPnYkUw').then(val => console.log(val));
// fetchSongDetails('3ygfdwvBJ2Y5XhJiiHFFZE').then(val => console.log(val.lyrics));
// searchSpotify('raj shamani', "show,episode").then(val => console.log(val));

export { fetchRandomPlaylistsOrPodcasts, getSectionsAndPlaylists, fetchUserPlaylists /* loadUserDetails from user_playlist_details.js */, fetchPlaylists /* loadUserDetails from leftContentCardData.js */, fetchRandomSong, fetchCategoriesWithImages, getSongDetails, getAllPlaylistsWithSongs, fetchPublicPlaylist, fetchSongDetails, searchSpotify };