const client_id = 'fa99f1012dea4fa292a3b9a593e5fd19';
const client_secret = '909967f80ec44c33b1738a2e09edbe5d';
const refresh_token = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA";

async function getAccessToken() {
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
        return data.access_token || null;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}

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

async function fetchPublicPlaylist(playlist_id) {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.error("Access token is required to fetch song details.");
        return null;
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

        console.log(JSON.stringify(playlistDetails));
        return playlistDetails;
    } catch (error) {
        console.error("Error fetching playlist details:", error);
        return null;
    }
}

fetchPublicPlaylist('0N3GW3dwHypqcvfcPnYkUw').then(playlistDetails => {
    if (playlistDetails) {
        console.log("Fetched Playlist Details:", playlistDetails);
    }
});

export { fetchPublicPlaylist };
