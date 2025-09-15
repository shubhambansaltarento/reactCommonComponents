import React from "react";
import { Box } from "@mui/material";

interface VideoPlayerProps {
  videoEmbedUrl: string;
  isOpen: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoEmbedUrl, isOpen }) => {
  if (!isOpen) return null;

  return (
    <Box
      style={{
        position: "relative",
        paddingTop: "56.25%",
        width: "100%",
      }}
    >
      <iframe
        src={videoEmbedUrl}
        title="YouTube video preview"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </Box>
  );
};

export default VideoPlayer;
