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
 * Fetches 100 random playlists or podcasts from multiple genres.
 */
async function fetchRandomPlaylistsOrPodcasts() {
    const now = Date.now();

    if (cache.playlistsCache && cache.cacheTimestamp && (now - cache.cacheTimestamp < 10 * 60 * 1000)) {
        console.log("✅ Using cached playlists/podcasts data");
        return cache.playlistsCache;
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
        return uniqueResults;

    } catch (error) {
        console.error(`❌ Error fetching playlists or podcasts: ${error.message}`);
        return [];
    }
}

// Execute function and log results
fetchRandomPlaylistsOrPodcasts().then(data => console.log("✅ Random Playlists or Podcasts:", data));

export { fetchRandomPlaylistsOrPodcasts };
