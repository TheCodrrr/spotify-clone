import Playlist from '../models/Playlist.js';

// Create a new playlist
export const createPlaylist = async (req, res) => {
    try {
        const { name, photo, description, songs } = req.body;

        if (!name || !photo || !description) {
        return res.status(400).json({ message: 'Name, photo, and description are required.' });
        }

        const newPlaylist = new Playlist({
        name,
        photo,
        description,
        songs: songs || [], // default to empty if not passed
        });

        const saved = await newPlaylist.save();
        console.log("New Playlist Created:",JSON.stringify(saved));
        res.status(201).json(saved);

    } catch (error) {
        res.status(500).json({ message: 'Error creating playlist', error });
    }
};
  
// GET: Get single playlist by ID
export const getPlaylistById = async (req, res) => {
    try {
      const playlist = await Playlist.findById(req.params.id);
      if (!playlist) return res.status(404).json({ message: "Playlist not found" });
      res.status(200).json(playlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// GET: Fetch all playlist details
export const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST: Add a new song to a playlist
export const addSongToPlaylist = async (req, res) => {
  const { playlistId } = req.body;
  const song = req.body.song; // should include songId, name, image, artists, album

  if (!playlistId || !song) return res.status(400).json({ message: "Missing playlistId or song data" });

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.songs.push(song);
    await playlist.save();
    res.status(200).json({ message: "Song added successfully", playlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT: Option 1 – Update name, photo, and description
export const updatePlaylistInfo = async (req, res) => {
  const { id } = req.params;
  const { name, photo, description } = req.body;

  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      { name, photo, description },
      { new: true }
    );
    res.status(200).json({ message: "Playlist info updated", updatedPlaylist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT: Option 2 – Add or remove a song from playlist
export const modifySongs = async (req, res) => {
  const { id } = req.params;
  const { action, song } = req.body;

  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (action === "add") {
      playlist.songs.push(song);
    } else if (action === "delete") {
      playlist.songs = playlist.songs.filter(s => s.songId !== song.songId);
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await playlist.save();
    res.status(200).json({ message: "Songs updated", playlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Remove entire playlist
export const deletePlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    await Playlist.findByIdAndDelete(id);
    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
