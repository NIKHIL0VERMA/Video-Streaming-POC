'use client';

import React from 'react';
import {
  MediaPlayer,
  MediaProvider,
} from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, title }) => {
  return (
    <MediaPlayer
      title={title || 'Video Player'}
      src={src}
      poster={poster}
      controls
      className="w-full max-w-3xl aspect-video"
    >
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default VideoPlayer;
