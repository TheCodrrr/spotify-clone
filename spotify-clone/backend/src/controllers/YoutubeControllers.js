import cache from "../../utils/cache.js";
import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY

// youtubeSearch.js
const YouTubePlayer = async (req, res) => {
  const { query } = req.body; // Extract query from request body
  
  if (cache.searchCache[query]) {
    return res.status(200).json({ videoId: cache.searchCache[query] });
  }

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
    cache.searchCache[query] = videoId;
    
    if (videoId) {
      return res.status(200).json({ videoId });
    } else {
      return res.status(404).json({ error: "No video found" });
    }
  } catch (error) {
    console.error('YouTube Search Error:', error);
    return res.status(500).json({ error: "YouTube search failed" });
  }
};

// Remove the test code since this is now a backend controller
// YouTubePlayer("Imagine Dragons Believer").then(videoId => {
//     if (videoId) {
//         console.log(`Video ID: ${videoId}`);
//     } else {
//         console.log("No video found.");
//     }
// }).catch(error => {
//     console.error("Error fetching video ID:", error);
// });

export { YouTubePlayer };