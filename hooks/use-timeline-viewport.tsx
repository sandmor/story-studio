import { useState, useEffect, useRef, useMemo } from "react";

interface UseTimelineViewportProps {
  initialPixelsPerSecond?: number;
  initialViewStartTime?: number;
}

export const useTimelineViewport = ({
  initialPixelsPerSecond = 100 / 60 / 60 / 24 / 30,
  initialViewStartTime = 0,
}: UseTimelineViewportProps = {}) => {
  const [pixelsPerSecond, setPixelsPerSecond] = useState(
    initialPixelsPerSecond
  );
  const [viewStartTime, setViewStartTime] = useState(initialViewStartTime);
  const [viewportWidth, setViewportWidth] = useState(0);

  const viewportRef = useRef<HTMLDivElement | null>(null);

  const viewEndTime = useMemo(() => {
    return viewStartTime + viewportWidth / pixelsPerSecond;
  }, [viewStartTime, viewportWidth, pixelsPerSecond]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === element) {
          setViewportWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    pixelsPerSecond,
    setPixelsPerSecond,
    viewStartTime,
    setViewStartTime,
    viewportWidth,
    viewEndTime,
    viewportRef,
  };
};