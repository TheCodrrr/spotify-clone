const CLIENT_ID = 'fa99f1012dea4fa292a3b9a593e5fd19';
const CLIENT_SECRET = '909967f80ec44c33b1738a2e09edbe5d';
const REFRESH_TOKEN = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA";

let cachedPlaylists = null;

// Utility function to introduce a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to get an access token using the refresh token
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

        if (!response.ok || !data.access_token) {
            console.error("Failed to get access token:", data);
            return null;
        }

        return data.access_token;

    } catch (error) {
        console.error("Error in getAccessToken:", error);
        return null;
    }
};

// Function to fetch user playlists
async function fetchUserPlaylists() {
    if (cachedPlaylists) {
        console.log("Using cached playlists.");
        return cachedPlaylists;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.log("Unable to fetch access token.");
        return [];
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
            return [];
        }

        const userPlaylists = data?.items?.filter(
            playlist => playlist?.owner?.id !== 'spotify'
        ) || [];

        cachedPlaylists = userPlaylists.map(playlist => ({
            user_playlist_image: playlist?.images?.[0]?.url || 'No image available',
            user_playlist_name: playlist?.name || 'Unnamed Playlist',
            user_playlist_id: playlist?.id || 'No ID available',
            user_playlist_link: playlist?.external_urls?.spotify || 'No link available',
            user_playlist_track_count: playlist?.tracks?.total || 0,
            user_playlist_owner: playlist?.owner?.display_name || 'Unknown Owner',
        }));

        console.log("Playlists fetched and cached:", cachedPlaylists);
        return cachedPlaylists;

    } catch (error) {
        console.error('Error fetching playlists:', error);
        return [];
    }
}

// Function to load user details and fetch playlists
const loadUserDetails = async () => {
    const userPlaylistDetails = await fetchUserPlaylists();
    return userPlaylistDetails;
};

// Fetch playlists initially (optional)
fetchUserPlaylists();

export { loadUserDetails };
