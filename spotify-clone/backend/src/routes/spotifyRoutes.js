import express from "express";
import { 
    fetchRandomPlaylistsOrPodcasts, 
    getSectionsAndPlaylists, 
    fetchUserPlaylists, 
    fetchPlaylists, 
    fetchRandomSong, 
    fetchCategoriesWithImages, 
    getSongDetails, 
    getAllPlaylistsWithSongs, 
    fetchPublicPlaylist, 
    fetchSongDetails, 
    searchSpotify 
} from "../controllers/SpotifyControllers.js"

const router = express.Router();

// Get random playlists or podcasts
router.get("/playpod/random", fetchRandomPlaylistsOrPodcasts);

// Get sections and playlists
router.get("/sections", getSectionsAndPlaylists);

// Get user playlists
router.get("/user/playlists", fetchUserPlaylists);

// Get playlists with detailed info
router.get("/playlists", fetchPlaylists);

// Get random song
router.get("/song/random", fetchRandomSong);

// Get categories with images
router.get("/categories", fetchCategoriesWithImages);

// Get song details by name (POST since it uses req.body)
router.post("/song/details", getSongDetails);

// Get all playlists with songs (supports pagination)
router.get("/playlists/songs", getAllPlaylistsWithSongs);

// Get public playlist by ID
router.get("/playlist/:playlist_id", fetchPublicPlaylist);

// Get song details by ID
router.get("/song/:song_id", fetchSongDetails);

// Search Spotify (GET with query parameters)
router.get("/search", searchSpotify);

export default router;