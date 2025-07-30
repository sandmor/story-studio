import React from "react";

interface TimelineRulerProps {
  startTime: number;
  endTime: number;
  pixelsPerTimeUnit: number;
  characterCount: number;
}

interface TimelineRulerHeaderProps {
  startTime: number;
  endTime: number;
  pixelsPerTimeUnit: number;
}

const formatTime = (time: number): string => {
  if (time < 100) {
    return time.toFixed(1);
  }
  return Math.round(time).toString();
};

export const TimelineRulerHeader: React.FC<TimelineRulerHeaderProps> = ({
  startTime,
  endTime,
  pixelsPerTimeUnit,
}) => {
  const timeRange = endTime - startTime;
  const majorInterval = Math.max(1, Math.floor(timeRange / 10));
  const labels = [];

  for (
    let time = Math.ceil(startTime / majorInterval) * majorInterval;
    time <= endTime;
    time += majorInterval
  ) {
    const x = (time - startTime) * pixelsPerTimeUnit;
    labels.push({ x, time });
  }

  return (
    <div
      className="relative h-full"
      style={{ width: timeRange * pixelsPerTimeUnit }}
    >
      {labels.map(({ x, time }) => (
        <div
          key={time}
          className="absolute top-0 h-full flex items-center justify-center text-xs font-medium text-muted-foreground"
          style={{ left: x - 30, width: 60 }}
        >
          {formatTime(time)}
        </div>
      ))}
    </div>
  );
};

export const TimelineRuler: React.FC<TimelineRulerProps> = ({
  startTime,
  endTime,
  pixelsPerTimeUnit,
  characterCount,
}) => {
  const timeRange = endTime - startTime;
  const rulerWidth = timeRange * pixelsPerTimeUnit;
  const rulerHeight = characterCount * 80; // 80 is h-20 for each track

  // Calculate grid intervals (adjust based on zoom level)
  const majorInterval = Math.max(1, Math.floor(timeRange / 10));
  const minorInterval = Math.max(0.1, majorInterval / 5);

  const majorLines = [];
  const minorLines = [];

  // Generate vertical grid lines
  for (
    let time = Math.ceil(startTime / majorInterval) * majorInterval;
    time <= endTime;
    time += majorInterval
  ) {
    const x = (time - startTime) * pixelsPerTimeUnit;
    majorLines.push(x);
  }

  for (
    let time = Math.ceil(startTime / minorInterval) * minorInterval;
    time <= endTime;
    time += minorInterval
  ) {
    const x = (time - startTime) * pixelsPerTimeUnit;
    if (!majorLines.some((majorX) => Math.abs(majorX - x) < 2)) {
      minorLines.push(x);
    }
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ width: rulerWidth, height: rulerHeight }}
    >
      {/* Vertical grid lines */}
      {majorLines.map((x, i) => (
        <div
          key={`major-${i}`}
          className="absolute top-0 bottom-0 w-px bg-timeline-grid"
          style={{ left: x }}
        />
      ))}
      {minorLines.map((x, i) => (
        <div
          key={`minor-${i}`}
          className="absolute top-0 bottom-0 w-px bg-timeline-grid opacity-50"
          style={{ left: x }}
        />
      ))}
    </div>
  );
};
