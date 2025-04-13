import express from 'express';
import upload from '../storage.js';
import {
    createPlaylist,
    getPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    updatePlaylistInfo,
    modifySongs,
    deletePlaylist,
    deleteSongFromPlaylist
} from '../controllers/PlaylistControllers.js';

const router = express.Router();

router.post('/', createPlaylist); // 👈 New route to create playlist
router.post('/song', addSongToPlaylist);
router.put('/info/:id', upload.single('photo'), updatePlaylistInfo);
router.get('/:id', getPlaylistById);
// router.get('/custom/playlist', getPlaylists);
router.put('/songs/:id', modifySongs);
router.get('/', getPlaylists);
// router.delete('/:id', deletePlaylist);
router.delete('/playlist/:id', deletePlaylist); // 👈 Updated route to delete playlist
router.delete('/song', deleteSongFromPlaylist);

export default router;
