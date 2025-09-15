// useCarouselIndex.ts
import { useState } from "react";

export const useCarouselIndex = (itemsLength: number) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? itemsLength - 1 : prev - 1));
  const handleNext = () => setActiveIndex((prev) => (prev === itemsLength - 1 ? 0 : prev + 1));
  const goToSlide = (index: number) => setActiveIndex(index);

    return { activeIndex, handlePrev, handleNext, goToSlide };
    };

    export default useCarouselIndex;
    