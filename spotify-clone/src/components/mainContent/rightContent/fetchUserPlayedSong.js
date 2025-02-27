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
        return data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
        return null;
    }
};

// Function to fetch user playlists
async function fetchUserPlaylists() {
    if (cachedPlaylists) {
        return cachedPlaylists;
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

        cachedPlaylists = data.items.map(playlist => ({
            playlist_id: playlist.id,
            playlist_name: playlist.name,
            playlist_image: playlist.images[0]?.url || 'No image available',
            playlist_owner: playlist.owner.display_name,
            playlist_tracks_url: playlist.tracks.href,
        }));

        return cachedPlaylists;

    } catch (error) {
        console.error("Error fetching playlists:", error);
    }
}

// Function to fetch detailed artist bio from Wikipedia
async function fetchArtistBio(artistName) {
    try {
        const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artistName)}`);
        const wikiData = await wikiResponse.json();

        if (wikiData.extract) {
            return wikiData.extract; // Return the summary from Wikipedia
        } else {
            return "No biography available.";
        }
    } catch (error) {
        console.error(`Error fetching Wikipedia bio for ${artistName}:`, error);
        return "No biography available.";
    }
}

let cachedSongPromise = null;

async function fetchRandomSong() {
    if (!cachedSongPromise) {
        cachedSongPromise = (async () => {
            const playlists = await fetchUserPlaylists();
            if (!playlists || playlists.length === 0) return;

            const accessToken = await getAccessToken();
            if (!accessToken) return;

            try {
                // Pick a random playlist
                const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

                // Fetch tracks from the selected playlist
                const tracksResponse = await fetch(randomPlaylist.playlist_tracks_url, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const tracksData = await tracksResponse.json();

                if (!tracksData.items || tracksData.items.length === 0) return;

                // Pick a random song from the playlist
                const randomTrack = tracksData.items[Math.floor(Math.random() * tracksData.items.length)].track;

                // Fetch main artist details
                const mainArtistId = randomTrack.artists[0].id;
                const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${mainArtistId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const artistData = await artistResponse.json();

                // Fetch artist bio from Wikipedia
                const artistBio = await fetchArtistBio(artistData.name);

                // Fetch additional artist roles (composer, lyricist, etc.)
                const creditsResponse = await fetch(`https://api.spotify.com/v1/tracks/${randomTrack.id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const creditsData = await creditsResponse.json();

                const contributors = creditsData.artists.map(artist => ({
                    name: artist.name,
                    role: artist.id === mainArtistId ? "Main Artist" : "Contributor",
                    profile_url: artist.external_urls.spotify
                }));

                // Build final data structure
                const detailedSong = {
                    song_name: randomTrack.name,
                    song_image: randomTrack.album.images[0]?.url || "No image available",
                    song_url: randomTrack.external_urls.spotify, // Unique song URL
                    playlist_name: randomPlaylist.playlist_name,
                    playlist_owner: randomPlaylist.playlist_owner,
                    artists: randomTrack.artists.map(a => ({
                        name: a.name,
                        profile_url: a.external_urls.spotify
                    })),
                    main_artist: {
                        name: artistData.name,
                        bio: artistBio, // Full Wikipedia bio
                        monthly_listeners: artistData.followers.total,
                        image: artistData.images[0]?.url || "No image available",
                        profile_url: artistData.external_urls.spotify
                    },
                    contributors: contributors
                };

                console.log("Final Song Data:", detailedSong);
                return detailedSong;
            } catch (error) {
                console.error("Error fetching random song:", error);
            }
        })();
    }

    return cachedSongPromise;
}

export { fetchRandomSong };