// useCarousel.ts
import { useCarouselIndex } from "./useCarouselIndex";
import { useCarouselKeyboard } from "./useCarouselKeyboard";
import { useCarouselAutoplay } from "./useCarouselAutoplay";

export const useCarousel = (
  itemsLength: number,
  autoPlay: boolean,
  autoPlayInterval: number
) => {
  const { activeIndex, handlePrev, handleNext, goToSlide } = useCarouselIndex(itemsLength);

  useCarouselKeyboard(handlePrev, handleNext);
  useCarouselAutoplay(autoPlay, autoPlayInterval, handleNext);

  return { activeIndex, handlePrev, handleNext, goToSlide };
};

export default useCarousel;