import axios from 'axios';
// working = AIzaSyBZhZksDi20sAQrp_W1XSeKJ0ujeSF_Klk
const API_KEY = "AIzaSyBZhZksDi20sAQrp_W1XSeKJ0ujeSF_Klk";
// AIzaSyAbxGH1SrNOmijcGCrQzbKIAyUv9AFhEHY
// AIzaSyBZhZksDi20sAQrp_W1XSeKJ0ujeSF_Klk
const searchCache = {};

const YouTubePlayer = async (query) => {
  if (searchCache[query]) return searchCache[query];

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 1,
        q: query,
        key: API_KEY,
        type: 'video',
        videoCategoryId: '10',
      },
    });

    const videoId = response.data.items[0]?.id?.videoId;
    searchCache[query] = videoId;
    return videoId || null;
  } catch (error) {
    console.error('YouTube Search Error:', error);
    return null;
  }
};

export default YouTubePlayer;

YouTubePlayer("Imagine Dragons Believer").then(videoId => {
    if (videoId) {
        // console.log(`Video ID: ${videoId}`);
    } else {
        // console.log("No video found.");
    }
}).catch(error => {
    console.error("Error fetching video ID:", error);
});