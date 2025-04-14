import React from 'react';
import ReactPlayer from 'react-player/youtube';

const AudioPlayer = ({ videoId }) => {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div style={{ height: 0, overflow: 'hidden' }}>
      <ReactPlayer
        url={videoUrl}
        playing
        controls
        width="0"
        height="0"
        config={{
          youtube: {
            playerVars: { modestbranding: 1 },
          },
        }}
      />
    </div>
  );
};

export default AudioPlayer;
