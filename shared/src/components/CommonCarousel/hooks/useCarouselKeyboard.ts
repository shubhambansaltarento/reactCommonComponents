// useCarouselKeyboard.ts
import { useEffect } from "react";

export const useCarouselKeyboard = (onPrev: () => void, onNext: () => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext]);
};

export default useCarouselKeyboard;
