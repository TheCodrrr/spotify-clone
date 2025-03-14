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
function extractSongs(tracks = []) {
    return tracks.slice(0, 4).map(track => ({
        id: track.id,
        name: track.name,
        image: track.album?.images[0]?.url || "",
        artists: track.artists.map(artist => artist.name),
        duration: track.duration_ms
    }));
}

// Extract Artists
function extractArtists(artists = []) {
    return artists.slice(0, 4).map(artist => ({
        id: artist.id,
        name: artist.name,
        image: artist.images?.[0]?.url || "",
        type: artist.type
    }));
}

// Extract Albums
function extractAlbums(albums = []) {
    return albums.slice(0, 4).map(album => ({
        id: album.id,
        name: album.name,
        image: album.images?.[0]?.url || "",
        releaseYear: album.release_date.split("-")[0],
        artists: album.artists.map(artist => artist.name)
    }));
}

// Extract Playlists
function extractPlaylists(playlists = []) {
    return playlists
        .filter(playlist => playlist !== null) // Remove null values
        .slice(0, 4)
        .map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.images?.[0]?.url || "",
            creator: playlist.owner?.display_name || "Unknown"
        }));
}

// Extract Podcasts (Shows)
function extractPodcasts(podcasts = []) {
    return podcasts.slice(0, 4).map(podcast => ({
        id: podcast.id,
        name: podcast.name,
        image: podcast.images?.[0]?.url || "",
        creator: podcast.publisher
    }));
}

// Extract Episodes
function extractEpisodes(episodes = []) {
    return episodes.slice(0, 4).map(episode => ({
        id: episode.id,
        name: episode.name,
        image: episode.images?.[0]?.url || "",
        releaseDate: episode.release_date,
        duration: episode.duration_ms
    }));
}

async function searchSpotify(query) {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
        console.error("Failed to get access token");
        return null;
    }

    console.log("Access Token:", accessToken);

    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist,show,episode&limit=50`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const data = await response.json();

        if (!data) return null;

        const categories = {
            songs: extractSongs(data.tracks?.items || []),
            artists: extractArtists(data.artists?.items || []),
            albums: extractAlbums(data.albums?.items || []),
            playlists: extractPlaylists(data.playlists?.items || []),
            podcasts: extractPodcasts(data.shows?.items || []),
            episodes: extractEpisodes(data.episodes?.items || []),
        };

        console.log("Formatted Categories:", categories);  // 🔍 Debugging the extracted results

        return categories;
    } catch (error) {
        console.error("Error searching Spotify:", error);
        return null;
    }
}

export { searchSpotify }