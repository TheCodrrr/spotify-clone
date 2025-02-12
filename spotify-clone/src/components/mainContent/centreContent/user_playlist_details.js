const CLIENT_ID = 'fa99f1012dea4fa292a3b9a593e5fd19';
const CLIENT_SECRET = '909967f80ec44c33b1738a2e09edbe5d';
const REFRESH_TOKEN = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA";

let cachedPlaylists = null;

// Utility function to introduce a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to get an access token using the refresh token
const getAccessToken = async () => {
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
};

// Function to fetch user playlists
async function fetchUserPlaylists() {
    // Check if playlists are cached
    if (cachedPlaylists) {
        console.log("Using cached playlists.");
        return cachedPlaylists; // Return cached playlists
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.log("Unable to fetch access token.");
        return;
    }

    try {
        // Introduce a rate-limit delay
        await delay(1000); // 1-second delay (adjust as necessary)

        // Fetch user playlists
        const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        // Check for rate limiting headers
        const remainingRequests = response.headers.get('X-RateLimit-Remaining');
        const rateLimitReset = response.headers.get('X-RateLimit-Reset');
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        console.log(`Current time: ${currentTime}`);
        console.log(`Remaining requests: ${remainingRequests}`);
        console.log(`Rate limit reset time: ${rateLimitReset}`);

        // If remaining requests are 0, wait until the rate limit is reset
        if (remainingRequests === '0') {
            const resetTime = parseInt(rateLimitReset, 10);
            const waitTime = resetTime - currentTime;

            if (waitTime > 0) {
                console.log(`Rate limit exceeded. Waiting for ${waitTime} seconds until reset.`);
                await delay(waitTime * 1000); // Wait until the reset time
            }
        }

        const data = await response.json();

        // Handle errors
        if (!response.ok) {
            console.error('Error fetching playlists:', data);
            return;
        }

        // Filter playlists created by the user (exclude Spotify's default playlists)
        const userPlaylists = data.items.filter(playlist => playlist.owner.id !== 'spotify');

        // Format playlist details
        cachedPlaylists = userPlaylists.map(playlist => ({
            user_playlist_image: playlist.images[0]?.url || 'No image available',
            user_playlist_name: playlist.name,
            user_playlist_id: playlist.id,
            user_playlist_link: playlist.external_urls.spotify,
            user_playlist_track_count: playlist.tracks.total,
            user_playlist_owner: playlist.owner.display_name
        }));
        console.log("Playlists fetched and cached:", cachedPlaylists);
        return cachedPlaylists; // Cache and return the formatted playlists

    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
}

// Function to load user details and fetch playlists
const loadUserDetails = async () => {
    const userPlaylistDetails = await fetchUserPlaylists();
    return userPlaylistDetails;
};

// Fetch playlists initially
fetchUserPlaylists();

// Export the loadUserDetails function
export { loadUserDetails };
