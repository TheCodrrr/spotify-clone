import dotenv from "dotenv";
import cache from "./cache.js";
dotenv.config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const refresh_token = process.env.REFRESH_TOKEN;

// const getAccessToken = async () => {
//     const response = await fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//             'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
//     });
//     const data = await response.json();
//     return data.access_token;
// };

async function getAccessToken() {
    const now = Date.now();

    // Return cached token if it's still valid
    if (cache.accessToken && cache.tokenExpiry > now) {
        // console.log("✅ Using cached access token");
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
        // console.log("🔑 New Token Response:", data);

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

const log = async () => {
    const token = await getAccessToken();
    console.log(token);
}

log()

export default getAccessToken;