import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  songId: { type: String, required: true },       // Spotify song ID
  name: { type: String, required: true },          // Song title
  image: { type: String, required: true },         // Cover image URL
  artists: [{ type: String, required: true }],     // Array of artist names
  duration: { type: Number, required: true },      // Duration in milliseconds
  addedDate: { type: Date, default: Date.now },    // Date when the song was added to the playlist
  album: { type: String, required: true },         // Album name
});

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true },         // Cloudinary image link
  description: { type: String, required: true },  // Playlist description
  songs: [songSchema],                             // Embedded song documents
}, { timestamps: true });


const db = mongoose.connection.useDb("spotify-management"); 
const Playlist = db.model('Playlist', playlistSchema);
export default Playlist;
