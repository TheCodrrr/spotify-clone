import axios from 'axios';
const API_KEY = "AIzaSyB44E51uViyTx-qK5LNMH-lyKa-sZIn7TU";

const YouTubePlayer = async (query) => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search`,
            {
                params: {
                    part: 'snippet',
                    maxResults: 1,
                    q: query,
                    key: API_KEY,
                    type: 'video',
                    videoCategoryId: '10', // Music
                },
            }
        );
        const videoId = response.data.items[0]?.id?.videoId;
        return videoId || null;
    } catch (error) {
        console.error('YouTube Search Error:', error);
        return null;
    }
};

export default YouTubePlayer;

YouTubePlayer("Imagine Dragons Believer").then(videoId => {
    if (videoId) {
        console.log(`Video ID: ${videoId}`);
    } else {
        console.log("No video found.");
    }
}).catch(error => {
    console.error("Error fetching video ID:", error);
});