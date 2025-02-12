const CLIENT_ID = 'fa99f1012dea4fa292a3b9a593e5fd19';
const CLIENT_SECRET = '909967f80ec44c33b1738a2e09edbe5d';
const REFRESH_TOKEN = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA";
const accessToken = "BQAs90mpP-GUoFv7mP7vkU9Bcl3oEymSWsAZmY9Q9o5i4mELUQ5x1YpVRmV7EPIxDnpfBFyal9Ecn7B1b3L35E2UFgroODDP0BgeBuRtuiJ4jbEpPhZgsoFs9Ey2bVk0zaa8VNzTtgCWWNtPAVBIm-mQPUHV3OwU9x52NxfoHG2lTtYtGlis7-f8rdshrBkfRNh5kHvV8mpvq9lPK_3fYozrbjM0g68kE6Y0OGTMiQV3hPuPIZJTwg"

const getAccessToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=refresh_token&refresh_token=' + REFRESH_TOKEN,
    });
    const data = await response.json();
    return data.access_token;
};

const fetchFromSpotify = async (endpoint, accessToken) => {
    let attempts = 0; // Track number of attempts for exponential backoff
    const maxAttempts = 5; // Max retry attempts before failing

    while (attempts < maxAttempts) {
        try {

            const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const responseData = await response.json();

            // Log the parsed JSON data
            console.log("From medium_category_card_details the response is: ", responseData);
        

            // Handle rate limit: check for 429 status and retry after 'Retry-After' time
            if (response.status === 429) {
                let retryAfter = 1000;
                if (response && response.headers) {
                    retryAfter = response.headers.get('Retry-After');
                }
                console.log(`Rate limit exceeded. Retrying after ${retryAfter} seconds.`);
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000)); // Wait for the retry period
                attempts++;
                continue; // Retry the request
            }

            // Handle successful response
            return response.json();
        } catch (error) {
            console.error('Error fetching from Spotify:', error);
            throw error;
        }
    }

    // If max retry attempts are exceeded, log and throw an error
    console.error('Max retry attempts exceeded');
    throw new Error('Max retry attempts exceeded');
};

const cache = {
    playlists: [], // Stores cached playlist data
    lastUpdated: null, // Timestamp of the last cache update
};

// Delay function for pausing execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchPlaylistTracks = async (playlistId, accessToken) => {
    try {
        const tracks = [];
        let nextEndpoint = `/playlists/${playlistId}/tracks`;

        while (nextEndpoint) {
            const response = await fetchFromSpotify(nextEndpoint, accessToken);
            if (response.items) {
                response.items.forEach(item => {
                    if (item.track && item.track.artists) {
                        tracks.push(...item.track.artists.map(artist => artist.name));
                    }
                });
            }
            nextEndpoint = response.next; // Spotify API provides the next URL for pagination
        }

        // Deduplicate artist names
        return Array.from(new Set(tracks));
    } catch (error) {
        console.error(`Error fetching tracks for playlist ${playlistId}:, error`);
        return [];
    }
};

const fetchRandomPublicPlaylists = async () => {
    try {
        // Check if cache is available and valid
        if (cache.playlists.length === 100) {
            console.log('Using cached data...');
            return cache.playlists;
        }

        console.log('Fetching data from Spotify API...');
        const accessToken = await getAccessToken();
        
        const currentUser = await fetchFromSpotify('/me', accessToken);
        const currentUserId = currentUser.id;

        const searchTerms = ['a', 'e', 'i', 'o', 'u']; // Common characters for diverse results
        let playlists = [];
        let termIndex = 0;

        // Fetch until we have 100 unique public playlists excluding personal ones
        while (playlists.length < 100 && termIndex < searchTerms.length) {
            const searchResults = await fetchFromSpotify(
                `/search?q=${searchTerms[termIndex]}&type=playlist&limit=50,
                ${accessToken}`
            );

            if (searchResults.playlists && searchResults.playlists.items) {
                const filteredPlaylists = searchResults.playlists.items
                    .filter(item => item !== null) // Remove null items
                    .filter(playlist => playlist.owner?.id !== currentUserId); // Exclude personal playlists

                // Deduplicate and add to the main list
                playlists = Array.from(
                    new Map(
                        [...playlists, ...filteredPlaylists].map(playlist => [playlist.id, playlist])
                    ).values()
                );
            }

            termIndex++; // Move to the next search term

            // Add delay between requests to avoid rate limits
            await delay(1000); // 1 second delay between requests
        }

        // Fetch playlist details (including artists) asynchronously
        const playlistDetails = await Promise.all(
            playlists.slice(0, 100).map(async playlist => {
                const artists = await fetchPlaylistTracks(playlist.id, accessToken); // Fetch artist names
                return {
                    id: playlist.id,
                    name: playlist.name,
                    description: playlist.description || "No description available",
                    image: playlist.images.length > 0 ? playlist.images[0].url : "No image available",
                    owner: playlist.owner?.display_name || "Unknown",
                    tracks: playlist.tracks?.total || 0,
                    artists, // Add artist names array
                };
            })
        );

        // Update cache
        cache.playlists = playlistDetails;
        cache.lastUpdated = new Date();

        console.log(playlistDetails);
        return playlistDetails;
    } catch (error) {
        console.error('Error fetching random public playlists:', error);
        return [];
    }
};

const loadMediumPlaylistDetails = async () => {
    const mediumPlaylistDetails = await fetchRandomPublicPlaylists();
    return mediumPlaylistDetails;
};

export { loadMediumPlaylistDetails };