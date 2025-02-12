const leftCardData = [
    {
        card_image: '',
        card_name: 'Liked Songs',
        card_type: 'Playlist',
        is_card_pinned: true,
        card_elm_count: 66,
        card_owner: 'The Aryan',
        is_last_active: false,
        is_playing: false,
    },
    {
        card_image: '',
        card_name: 'Old',
        card_type: 'Playlist',
        is_card_pinned: false,
        card_elm_count: 35,
        card_owner: 'The Aryan',
        is_last_active: true,
        is_playing: false,
    },
    {
        card_image: '',
        card_name: 'Best',
        card_type: 'Playlist',
        is_card_pinned: false,
        card_elm_count: 70,
        card_owner: 'The Aryan',
        is_last_active: false,
        is_playing: false,
    },
    {
        card_image: '',
        card_name: 'Love',
        card_type: 'Playlist',
        is_card_pinned: false,
        card_elm_count: 38,
        card_owner: 'The Aryan',
        is_last_active: false,
        is_playing: false,
    },
    {
        card_image: '',
        card_name: 'English',
        card_type: 'Playlist',
        is_card_pinned: false,
        card_elm_count: 10,
        card_owner: 'The Aryan',
        is_last_active: false,
        is_playing: false,
    },
    {
        card_image: '',
        card_name: 'Garba',
        card_type: 'Playlist',
        is_card_pinned: false,
        card_elm_count: 6,
        card_owner: 'The Aryan',
        is_last_active: false,
        is_playing: false,
    },
    {
        card_image: '',
        card_name: 'G. O. A. T',
        card_type: 'Playlist',
        is_card_pinned: false,
        card_elm_count: 58,
        card_owner: 'The Aryan',
        is_last_active: false,
        is_playing: false,
    },
    {
        card_image: '',
        card_name: 'Loved Ones',
        card_type: 'Playlist',
        is_card_pinned: false,
        card_elm_count: 10,
        card_owner: 'The Aryan',
        is_last_active: false,
        is_playing: false,
    },
];

export default leftCardData;


const CLIENT_ID = 'fa99f1012dea4fa292a3b9a593e5fd19';
const CLIENT_SECRET = '909967f80ec44c33b1738a2e09edbe5d';
const REFRESH_TOKEN = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA";

// Example of pinned playlists (this should be managed in your application)
const pinnedPlaylists = ['playlist_id_1', 'playlist_id_2'];  // Example playlist IDs

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
const fetchPlaylists = async () => {
    if (cachedPlaylists) {
        console.log('Returning cached playlists');
        return cachedPlaylists;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.log("Unable to fetch access token.");
        return;
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
            return;
        }

        // Fetch currently playing track
        const currentlyPlayingTrackId = await getCurrentlyPlayingTrack(accessToken);

        // Map the playlist data to the required format
        const formattedPlaylists = data.items.map(playlist => {
            const isPinned = pinnedPlaylists.includes(playlist.id);

            // Ensure the playlist has tracks before attempting to check if a track is from the playlist
            const playlistTracks = playlist.tracks?.items || [];

            // Ensure currentlyPlayingTrackId is valid before checking if it's in the playlist
            const isLastActive = currentlyPlayingTrackId && playlistTracks.some(track => track.id === currentlyPlayingTrackId);
            const isPlaying = currentlyPlayingTrackId && playlistTracks.some(track => track.id === currentlyPlayingTrackId);

            console.log(`Playlist: ${playlist.name}, isLastActive: ${isLastActive}, isPlaying: ${isPlaying}`);

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
        cachedPlaylists = formattedPlaylists;

        // Return the formatted playlists
        return formattedPlaylists;

    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
};

// Function to load user details and fetch playlists
const loadUserDetails = async () => {
    const userPlaylistDetails = await fetchPlaylists();
    return userPlaylistDetails;
};

// Call the function to load the playlists
loadUserDetails().then(playlists => {
    console.log(playlists);
});

export { loadUserDetails };