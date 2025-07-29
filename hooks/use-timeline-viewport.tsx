import { useState, useEffect, useRef, useMemo } from "react";

interface UseTimelineViewportProps {
  initialPixelsPerTimeUnit?: number;
  initialViewStartTime?: number;
}

export const useTimelineViewport = ({
  initialPixelsPerTimeUnit = 100,
  initialViewStartTime = 0,
}: UseTimelineViewportProps = {}) => {
  const [pixelsPerTimeUnit, setPixelsPerTimeUnit] = useState(
    initialPixelsPerTimeUnit
  );
  const [viewStartTime, setViewStartTime] = useState(initialViewStartTime);
  const [viewportWidth, setViewportWidth] = useState(0);

  const viewportRef = useRef<HTMLDivElement | null>(null);

  const viewEndTime = useMemo(() => {
    return viewStartTime + viewportWidth / pixelsPerTimeUnit;
  }, [viewStartTime, viewportWidth, pixelsPerTimeUnit]);

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
    pixelsPerTimeUnit,
    setPixelsPerTimeUnit,
    viewStartTime,
    setViewStartTime,
    viewportWidth,
    viewEndTime,
    viewportRef,
  };
};
