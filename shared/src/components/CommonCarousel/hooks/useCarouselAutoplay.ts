// useCarouselAutoplay.ts
'use client';
import { useEffect, useRef } from "react";

export const useCarouselAutoplay = (
  enabled: boolean,
  interval: number,
  onNext: () => void
) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (enabled) intervalRef.current = setInterval(onNext, interval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, interval, onNext]);
};
export default useCarouselAutoplay;