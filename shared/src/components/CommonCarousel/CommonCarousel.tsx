'use client'
import React from "react";
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useCarousel } from "./hooks/useCarousel"; // <-- composed hook
import Image from "next/image";

interface CarouselItem {
  announcementId: string;
  media?: {
    url: string;
  }[];
  title: string;
  description: string;
  validTo: string;
  criticality?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  dotsStyle?: 'dots' | 'counter'; // New prop to control dots vs counter
  onReadMore?: (id: string) => void;
  baseUrl?: string;
}

// Subcomponent: description + ReadMore (used in both layouts)
const DescriptionBlock: React.FC<{
  item: CarouselItem;
  onReadMore?: (id: string) => void;
  isImage?: boolean;
}> = ({ item, onReadMore, isImage = false }) => (
  <div className="flex flex-col">
    <Typography
      variant="body2"
      className={`text-${isImage ? "white" : "gray-800"} text-xs sm:text-sm md:text-base leading-tight ${
        isImage ? "line-clamp-2 sm:line-clamp-3" : ""
      }`}
    >
      {item?.description}
    </Typography>

    {onReadMore && isImage && (
      <button
        onClick={() => onReadMore(item.announcementId)}
        className="text-white text-xs sm:text-sm underline hover:no-underline transition-all duration-200 mt-1 self-start cursor-pointer"
      >
        Read more
      </button>
    )}
  </div>
);

// Subcomponent: image layout
const ImageLayout: React.FC<{
  item: CarouselItem;
  baseUrl?: string;
  onReadMore?: (id: string) => void;
}> = ({ item, onReadMore, baseUrl }) => {
  return (
  <>
    {item?.media && item?.media[0].url && (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <Image
          width={700}
          height={400}
          src={`${baseUrl}${item?.media[0].url}`}
          alt={item?.title}
          className="w-full h-full object-contain"
          unoptimized
        />
      </div>
    )}

    {/*  Title at top with responsive padding and shorter gradient */}
    <div className="absolute top-0 left-0 w-full p-2 sm:p-4 md:p-6 bg-gradient-to-b from-black/70 via-black/40 to-transparent h-16 sm:h-20 md:h-24">
      <Typography
        variant="body1"
        className="text-white font-bold text-sm sm:text-lg md:text-xl lg:text-2xl leading-tight"
      >
        {item?.title}
      </Typography>
    </div>

    <div className="absolute bottom-0 left-0 w-full flex flex-col p-2 sm:p-4 md:p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent min-h-16 sm:min-h-20 md:min-h-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex-1 min-w-0 max-w-full sm:max-w-[65%]">
          <DescriptionBlock item={item} onReadMore={onReadMore} isImage />
        </div>
        <Typography
          variant="body2"
          className="text-white text-xs sm:text-sm md:text-base lg:text-lg text-left sm:text-right whitespace-nowrap flex-shrink-0"
        >
          {item?.validTo
            ? new Date(item.validTo).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""}
        </Typography>
      </div>
    </div>
  </>
)
};

// Subcomponent: plain card layout
const PlainLayout: React.FC<{ item: CarouselItem; onReadMore?: (id: string) => void }> = ({
  item,
  onReadMore,
}) => (
  <div className="relative flex flex-col justify-between h-full w-full min-w-full p-3 sm:p-4 md:p-6 bg-gray-100 rounded-2xl">
    <div className="flex-shrink-0 mb-3 sm:mb-4">
      <Typography
        variant="body1"
        className="text-black font-bold text-base sm:text-lg md:text-xl lg:text-2xl leading-tight"
      >
        {item?.title}
      </Typography>
    </div>

    <div className="flex-1"></div>

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 w-full">
      <div className="flex flex-col flex-1 min-w-0 max-w-full sm:max-w-[70%]">
        <Typography
          variant="body2"
          className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed break-words line-clamp-3 sm:line-clamp-4 md:line-clamp-5"
        >
          {item?.description}
        </Typography>
        {onReadMore && (
          <button
            onClick={() => onReadMore(item?.announcementId)}
            className="text-gray-800 text-xs sm:text-sm md:text-base underline hover:no-underline transition-all duration-200 mt-2 self-start cursor-pointer font-medium"
          >
            Read more
          </button>
        )}
      </div>

      <Typography
        variant="body2"
        className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg text-left sm:text-right whitespace-nowrap flex-shrink-0 font-medium"
      >
        {item?.validTo
          ? new Date(item.validTo).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : ""}
      </Typography>
    </div>
  </div>
);

// Main CarouselSlide
const CarouselSlide: React.FC<{
   item: CarouselItem; height: number; baseUrl?: string; onReadMore?: (id: string) => void }> = ({
  item,
  height,
  onReadMore,
  baseUrl
}) => (
  <Card className="w-full h-full relative rounded-2xl overflow-hidden" style={{ height }}>
    {item?.media?.length && item?.media[0].url ? (
      <ImageLayout item={item} onReadMore={onReadMore} baseUrl={baseUrl} />
    ) : (
      <PlainLayout item={item} onReadMore={onReadMore} />
    )}
  </Card>
);



const CarouselArrows: React.FC<{ onPrev: () => void; onNext: () => void }> = ({
  onPrev,
  onNext,
}) => (
  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex bg-black/40 rounded-full py-1">
    <IconButton
      onClick={onPrev}
      className="text-white hover:bg-white/20"
      size="small"
    >
      <ArrowBackIos fontSize="small" />
    </IconButton>
    <IconButton
      onClick={onNext}
      className="text-white hover:bg-white/20"
      size="small"
    >
      <ArrowForwardIos fontSize="small" />
    </IconButton>
  </div>
);

const CarouselDots: React.FC<{
  count: number;
  activeIndex: number;
  goToSlide: (i: number) => void;
  dotsStyle?: 'dots' | 'counter';
}> = ({ count, activeIndex, goToSlide, dotsStyle = 'dots' }) => {
  const handlePrev = () => {
    const prevIndex = activeIndex === 0 ? count - 1 : activeIndex - 1;
    goToSlide(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = activeIndex === count - 1 ? 0 : activeIndex + 1;
    goToSlide(nextIndex);
  };

  if (dotsStyle === 'counter') {
    return (
      <div className="w-full flex justify-start items-center gap-2 py-3">
        <div className="flex items-center">
          <IconButton
            onClick={handlePrev}
            className="text-gray-600 hover:text-gray-800 p-1"
            size="small"
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          
          <div className="min-w-[25px] text-left">
            <Typography
              variant="body2"
              className="text-gray-600 font-medium"
            >
              <span className="text-lg font-bold text-gray-800">{activeIndex + 1}</span>
              <span className="text-sm">/{count}</span>
            </Typography>
          </div>
          
          <IconButton
            onClick={handleNext}
            className="text-gray-600 hover:text-gray-800 p-1"
            size="small"
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center py-3">
      <div className="flex space-x-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === activeIndex
                ? "bg-blue-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export const CommonCarousel: React.FC<CarouselProps> = ({
  items,
  height = 300,
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = true,
  dotsStyle = 'dots', // Default to dots
  baseUrl,
  onReadMore,
}) => {
  const { activeIndex, handlePrev, handleNext, goToSlide } = useCarousel(
    items.length,
    autoPlay,
    autoPlayInterval
  );

  return (
    <div
      className="w-full overflow-hidden rounded-2xl p-0 md:p-2 md:px-4"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <CarouselSlide
          item={items[activeIndex]}
          height={height}
          onReadMore={onReadMore}
          baseUrl={baseUrl}
        />
        {showArrows && (
          <CarouselArrows onPrev={handlePrev} onNext={handleNext} />
        )}
      </div>

      <div className="flex items-center justify-between mt-2 px-4">
        {showDots && (
          <CarouselDots
            count={items.length}
            activeIndex={activeIndex}
            goToSlide={goToSlide}
            dotsStyle={dotsStyle}
          />
        )}
      </div>
    </div>
  );
};


