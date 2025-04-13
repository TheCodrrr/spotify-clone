import express from 'express';
import {
    createPlaylist,
    getPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    updatePlaylistInfo,
    modifySongs,
    deletePlaylist
} from '../controllers/PlaylistControllers.js';

const router = express.Router();

router.post('/', createPlaylist); // 👈 New route to create playlist
router.post('/song', addSongToPlaylist);
router.put('/info/:id', updatePlaylistInfo);
router.get('/:id', getPlaylistById);
router.put('/songs/:id', modifySongs);
router.get('/', getPlaylists);
router.delete('/:id', deletePlaylist);

export default router;
