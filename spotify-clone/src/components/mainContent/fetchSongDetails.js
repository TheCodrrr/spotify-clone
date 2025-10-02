import axios from 'axios';
import * as cheerio from 'cheerio';

const client_id = 'fa99f1012dea4fa292a3b9a593e5fd19';
const client_secret = '909967f80ec44c33b1738a2e09edbe5d';
const refresh_token = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA";
const GENIUS_ACCESS_TOKEN = "C2iYY-_2fgk9N7ceEYWHIbaGODy-9lXmMfa33lFmefytcaFRChuB3EmiAAE5YBqO";

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

async function fetchSongDetails(song_id) {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.error("Failed to fetch Spotify access token.");
        return null;
    }

    const songUrl = `https://api.spotify.com/v1/tracks/${song_id}`;
    try {
        const response = await fetch(songUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) throw new Error("Failed to fetch song details");

        const songData = await response.json();

        // Fetch album details
        const album = songData.album;
        const releaseYear = album.release_date.split('-')[0]; // Extract year
        const albumImage = album.images?.[0]?.url || null; // Get album cover image

        // Fetch artist details
        const artists = await Promise.all(
            songData.artists.map(async (artist) => {
                const artistResponse = await fetch(artist.href, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                if (!artistResponse.ok) return null;
                const artistData = await artistResponse.json();

                return {
                    name: artistData.name,
                    image: artistData.images?.[0]?.url || null
                };
            })
        );

        // Fetch play count (from last.fm API)
        const playCount = await fetchPlayCount(songData.name, artists[0]?.name);

        // Fetch lyrics from Genius API
        let lyrics = await fetchLyrics(songData.name, artists[0]?.name);
        lyrics = lyrics.replace(/([A-Z])/g, '\n$1'); // Add \n before every capital letter

        const songDetails = {
            name: songData.name,
            album: album.name,
            release_year: releaseYear,
            duration_ms: songData.duration_ms,
            album_image: albumImage, // Add album image to response
            total_play_count: playCount,
            lyrics: lyrics,
            artists: artists.filter(a => a !== null) // Remove null values
        };

        // console.log(songDetails);
        return songDetails;
    } catch (error) {
        console.error("Error fetching song details:", error);
        return null;
    }
}

async function fetchPlayCount(songName, artistName) {
    try {
        const url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=your_lastfm_api_key&artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(songName)}&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        return data?.track?.playcount || 0;
    } catch (error) {
        console.error("Error fetching play count:", error);
        return 0;
    }
}

async function fetchLyrics(songName, artistName) {
    try {
        const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(songName + ' ' + artistName)}`;
        
        const response = await fetch(`https://cors-anywhere.herokuapp.com/${searchUrl}`, {
            headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
        });

        const data = await response.json();
        const songPath = data.response.hits[0]?.result?.path;

        if (!songPath) return "Lyrics not found";

        // Scrape lyrics
        const lyricsPageUrl = `https://genius.com${songPath}`;
        const lyricsResponse = await axios.get(`https://cors-anywhere.herokuapp.com/${lyricsPageUrl}`);
        const $ = cheerio.load(lyricsResponse.data);
        let lyrics = $('div[data-lyrics-container="true"]').text().trim();

        return lyrics || "Lyrics not found";
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        return "Lyrics not found";
    }
}


// Example usage
fetchSongDetails('3ygfdwvBJ2Y5XhJiiHFFZE'); // Replace with a real Spotify song ID

export { fetchSongDetails };
