import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';

const AudioPlayer = ({ videoId, play, pause, restart, onProgress }) => {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  useEffect(() => {
    if (play) setPlaying(true);
  }, [play]);

  useEffect(() => {
    if (pause) setPlaying(false);
  }, [pause]);

  useEffect(() => {
    if (restart && playerRef.current) {
      playerRef.current.seekTo(0);
      setPlaying(true);
    }
  }, [restart]);

  // Handle progress updates from ReactPlayer
  const handleProgress = (state) => {
    if (onProgress && typeof onProgress === 'function') {
      onProgress(state);
    }
  };

  return (
    <ReactPlayer
      ref={playerRef}
      url={videoUrl}
      playing={playing}
      controls={false}
      width="0"
      height="0"
      onProgress={handleProgress}
      progressInterval={1000} // Update progress every second
    />
  );
};

export default AudioPlayer;
