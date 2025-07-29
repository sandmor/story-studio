import { useEffect, useRef } from "react";

interface UseSyncScrollsProps {
  leftPanelRef: React.RefObject<HTMLDivElement | null>;
  rightPanelRef: React.RefObject<HTMLDivElement | null>;
}

export const useSyncScrolls = ({
  leftPanelRef,
  rightPanelRef,
}: UseSyncScrollsProps) => {
  const isSyncingLeftScroll = useRef(false);
  const isSyncingRightScroll = useRef(false);

  useEffect(() => {
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;

    if (!leftPanel || !rightPanel) return;

    const handleLeftScroll = () => {
      if (!isSyncingLeftScroll.current) {
        isSyncingRightScroll.current = true;
        rightPanel.scrollTop = leftPanel.scrollTop;
      }
      isSyncingLeftScroll.current = false;
    };

    const handleRightScroll = () => {
      if (!isSyncingRightScroll.current) {
        isSyncingLeftScroll.current = true;
        leftPanel.scrollTop = rightPanel.scrollTop;
      }
      isSyncingRightScroll.current = false;
    };

    leftPanel.addEventListener("scroll", handleLeftScroll);
    rightPanel.addEventListener("scroll", handleRightScroll);

    return () => {
      leftPanel.removeEventListener("scroll", handleLeftScroll);
      rightPanel.removeEventListener("scroll", handleRightScroll);
    };
  }, [leftPanelRef, rightPanelRef]);
};
