const client_id = 'fa99f1012dea4fa292a3b9a593e5fd19';
const client_secret = '909967f80ec44c33b1738a2e09edbe5d';
const refresh_token = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA";

let cache = {
    accessToken: null,
    tokenExpiry: null,
    playlistsCache: null,
    cacheTimestamp: null
};

/**
 * Fetch a new Spotify access token using the refresh token and store it in cache.
 */
async function getAccessToken() {
    const now = Date.now();

    // Return cached token if it's still valid
    if (cache.accessToken && cache.tokenExpiry > now) {
        console.log("✅ Using cached access token");
        return cache.accessToken;
    }

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
        console.log("🔑 New Token Response:", data);

        if (!response.ok || !data.access_token) {
            throw new Error(`Error fetching token: ${data.error_description || 'Unknown error'}`);
        }

        // Cache token and expiry time (Spotify tokens usually last for 1 hour)
        cache.accessToken = data.access_token;
        cache.tokenExpiry = now + (data.expires_in * 1000); // expires_in is in seconds

        return data.access_token;
    } catch (error) {
        console.error('❌ Error fetching access token:', error.message);
        return null;
    }
}

/**
 * Fetches all artists from a playlist.
 */
async function fetchPlaylistArtists(playlistId, accessToken) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) throw new Error(`Error fetching playlist tracks: ${response.status}`);

        const data = await response.json();
        const artistsSet = new Set();

        data.items.forEach(track => {
            track.track?.artists?.forEach(artist => {
                if (artist.name) artistsSet.add(artist.name);
            });
        });

        return Array.from(artistsSet);
    } catch (error) {
        console.error(`❌ Error fetching playlist artists: ${error.message}`);
        return [];
    }
}

/**
 * Fetches 50 random playlists or podcasts from Spotify with caching.
 */
async function fetchRandomPlaylistsOrPodcasts() {
    const now = Date.now();

    // Use cache if data is less than 10 minutes old
    if (cache.playlistsCache && cache.cacheTimestamp && (now - cache.cacheTimestamp < 10 * 60 * 1000)) {
        console.log("✅ Using cached playlists/podcasts data");
        return cache.playlistsCache;
    }

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) throw new Error('⚠️ Failed to obtain access token');

        const genres = ["pop", "rock", "jazz", "hip-hop", "electronic", "classical", "reggae", "indie", "blues", "metal"];
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        const offset = Math.floor(Math.random() * 900);

        const endpoint = `https://api.spotify.com/v1/search?q=${randomGenre}&type=playlist,show&limit=10&offset=${offset}`;

        console.log(`🔍 Fetching from: ${endpoint}`);

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("🎵 API Response:", JSON.stringify(data, null, 2));

        let results = [];

        // Extract playlist data safely
        if (data.playlists?.items && Array.isArray(data.playlists.items)) {
            for (const playlist of data.playlists.items) {
                if (playlist && playlist.id) {
                    const artists = await fetchPlaylistArtists(playlist.id, accessToken);
                    results.push({
                        id: playlist.id,
                        name: playlist.name,
                        description: playlist.description || "No description available",
                        image: playlist.images?.[0]?.url || null,
                        total_songs: playlist.tracks?.total || 0,
                        spotifyUrl: playlist.external_urls?.spotify || null,
                        type: "playlist",
                        artists: artists // ✅ Added artists list
                    });
                }
            }
        }

        // Extract podcast (show) data safely
        if (data.shows?.items && Array.isArray(data.shows.items)) {
            results = results.concat(
                data.shows.items
                    .filter(show => show && show.id)
                    .map(show => ({
                        id: show.id,
                        name: show.name,
                        description: show.description || "No description available",
                        image: show.images?.[0]?.url || null,
                        total_songs: show.total_episodes || 0,
                        spotifyUrl: show.external_urls?.spotify || null,
                        type: "podcast",
                        artists: [show.publisher] // ✅ Using publisher as "artist" for podcasts
                    }))
            );
        }

        // Store results in cache
        cache.playlistsCache = results;
        cache.cacheTimestamp = now;

        return results;

    } catch (error) {
        console.error(`❌ Error fetching random playlists or podcasts: ${error.message}`);
        return [];
    }
}

// Execute function and log results
fetchRandomPlaylistsOrPodcasts().then(data => console.log("✅ Random Playlists or Podcasts:", data));

export { fetchRandomPlaylistsOrPodcasts }