// MusicPlayerContext.jsx
import { createContext, useContext, useState } from 'react';

const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const [songInfo, setSongInfo] = useState(null);
  const [playbackTime, setPlaybackTime] = useState(0); // in milliseconds

  const playSong = (songData) => {
    setSongInfo(songData);
    setPlaybackTime(0); // reset time when new song is played
  };

  // Optional: Callback to update playback time externally (e.g., from player component)
  const updatePlaybackTime = (timeInMs) => {
    setPlaybackTime(timeInMs);
  };

  return (
    <MusicPlayerContext.Provider value={{ songInfo, playSong, playbackTime, updatePlaybackTime }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => useContext(MusicPlayerContext);
