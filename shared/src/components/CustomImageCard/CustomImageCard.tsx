import React from "react";
import { Box, Typography } from "@mui/material";

interface ImageCardProps {
  image: string;
  heading?: string;
  date?: string;
  description?: string;
  maxHeight?: string;
  height?: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  heading,
  date,
  description,
  maxHeight = "220",
  height = "220px"
}) => {
  return (
    <Box
      className="relative w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center"
      sx={{ 
        height: height,
        maxHeight: `${maxHeight}px`
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={image}
        alt="preview"
        className="w-full h-full object-contain"
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Title at top with gradient - matches CommonTabPanel */}
      <Box 
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 via-black/40 to-transparent"
        sx={{ 
          padding: { xs: '8px', sm: '16px' },
          height: { xs: '64px', sm: '80px' }
        }}
      >
        <Typography
          variant="h6"
          className="text-white font-semibold leading-tight"
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1.125rem', md: '1.25rem' }
          }}
        >
          {heading}
        </Typography>
      </Box>

      {/* Description and date at bottom with gradient - matches CommonTabPanel */}
      <Box 
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/40 to-transparent"
        sx={{ 
          padding: { xs: '8px', sm: '16px' },
          minHeight: { xs: '64px', sm: '80px' }
        }}
      >
        <Box 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
          sx={{ gap: { xs: '8px', sm: '16px' } }}
        >
          {/* Description */}
          <Box 
            className="flex-1 min-w-0"
            sx={{ maxWidth: { xs: '100%', sm: '70%' } }}
          >
            <Typography
              variant="body2"
              className="text-white leading-tight"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: '-webkit-box',
                WebkitLineClamp: { xs: 2, sm: 3 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {description}
            </Typography>
          </Box>
          
          {/* Date */}
          <Typography
            variant="body2"
            className="text-white whitespace-nowrap flex-shrink-0"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {date}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};