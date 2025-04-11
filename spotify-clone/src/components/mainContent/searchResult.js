const CLIENT_ID = 'fa99f1012dea4fa292a3b9a593e5fd19';
const CLIENT_SECRET = '909967f80ec44c33b1738a2e09edbe5d';
const REFRESH_TOKEN = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getAccessToken = async () => {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`,
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
        return null;
    }
};

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

// Extract Podcasts (Shows)
function extractPodcasts(podcasts = [], listLength) {
    return podcasts.slice(0, listLength).map(podcast => ({
        id: podcast.id,
        name: podcast.name,
        image: podcast.images?.[0]?.url || "",
        creator: podcast.publisher
    }));
}

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

async function searchSpotify(query, searchType) {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
        console.error("Failed to get access token");
        return null;
    }

    console.log("Access Token:", accessToken);

    let url = "";
    if (!searchType) url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist,show,episode&limit=50`;
    else url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${searchType}&limit=50`

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const data = await response.json();

        if (!data) return null;

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


        console.log("Formatted Categories:", fetchedData);  // 🔍 Debugging the extracted results
        console.log("Formatted Categories Length:", fetchedData.length);  // 🔍 Debugging the extracted results

        return fetchedData;
    } catch (error) {
        console.error("Error searching Spotify:", error);
        return null;
    }
}

searchSpotify('tune', "show,episode")

export { searchSpotify }