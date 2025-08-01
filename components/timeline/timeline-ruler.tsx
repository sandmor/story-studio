
import React from "react";
import {
  secondsToDate,
  dateToSeconds,
  isLeapYear,
  getDaysInMonth,
  SECONDS_PER_DAY,
  SECONDS_PER_YEAR,
} from "@/lib/time";

interface TimelineRulerProps {
  startTime: number;
  endTime: number;
  pixelsPerSecond: number;
  characterCount: number;
}

interface TimelineRulerHeaderProps {
  startTime: number;
  endTime: number;
  pixelsPerSecond: number;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getTickLevel = (pixelsPerSecond: number) => {
  const pixelsPerDay = pixelsPerSecond * SECONDS_PER_DAY;
  const pixelsPerMonth = pixelsPerDay * 30; // Approximation
  const pixelsPerYear = pixelsPerSecond * SECONDS_PER_YEAR;

  if (pixelsPerDay > 40) return "day";
  if (pixelsPerMonth > 50) return "month";
  if (pixelsPerYear > 50) return "year";
  return "decade";
};

const formatLabel = (
  time: number,
  level: "decade" | "year" | "month" | "day"
) => {
  const date = secondsToDate(time);
  switch (level) {
    case "decade":
      return `Year ${Math.floor(date.year / 10) * 10}`;
    case "year":
      return `Year ${date.year}`;
    case "month":
      return `${MONTHS[date.month - 1]} ${date.year}`;
    case "day":
      return `${MONTHS[date.month - 1]} ${date.day}`;
  }
};

export const TimelineRulerHeader: React.FC<TimelineRulerHeaderProps> = ({
  startTime,
  endTime,
  pixelsPerSecond,
}) => {
  const timeRange = endTime - startTime;
  const labels: {
    time: number;
    level: "decade" | "year" | "month" | "day";
  }[] = [];
  const tickLevel = getTickLevel(pixelsPerSecond);

  let currentTime = startTime;
  const startDate = secondsToDate(startTime);

  switch (tickLevel) {
    case "decade":
      currentTime = dateToSeconds({
        year: Math.floor(startDate.year / 10) * 10,
        month: 1,
        day: 1,
      });
      while (currentTime < endTime) {
        labels.push({ time: currentTime, level: tickLevel });
        const currentYear = secondsToDate(currentTime).year;
        currentTime = dateToSeconds({
          year: currentYear + 10,
          month: 1,
          day: 1,
        });
      }
      break;
    case "year":
      currentTime = dateToSeconds({ year: startDate.year, month: 1, day: 1 });
      while (currentTime < endTime) {
        labels.push({ time: currentTime, level: tickLevel });
        const currentYear = secondsToDate(currentTime).year;
        currentTime = dateToSeconds({
          year: currentYear + 1,
          month: 1,
          day: 1,
        });
      }
      break;
    case "month":
      currentTime = dateToSeconds({
        year: startDate.year,
        month: startDate.month,
        day: 1,
      });
      while (currentTime < endTime) {
        labels.push({ time: currentTime, level: tickLevel });
        let { year, month } = secondsToDate(currentTime);
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
        currentTime = dateToSeconds({ year, month, day: 1 });
      }
      break;
    case "day":
      currentTime =
        dateToSeconds({
          year: startDate.year,
          month: startDate.month,
          day: startDate.day,
        }) -
        (dateToSeconds({
          year: startDate.year,
          month: startDate.month,
          day: startDate.day,
        }) %
          SECONDS_PER_DAY);
      while (currentTime < endTime) {
        labels.push({ time: currentTime, level: tickLevel });
        currentTime += SECONDS_PER_DAY;
      }
      break;
  }

  return (
    <div
      className="relative h-full"
      style={{ width: timeRange * pixelsPerSecond }}
    >
      {labels.map(({ time, level }) => (
        <div
          key={time}
          className="absolute top-0 h-full flex items-center justify-center text-xs font-medium text-muted-foreground"
          style={{
            left: (time - startTime) * pixelsPerSecond - 30,
            width: 60,
          }}
        >
          {formatLabel(time, level)}
        </div>
      ))}
    </div>
  );
};

export const TimelineRuler: React.FC<TimelineRulerProps> = ({
  startTime,
  endTime,
  pixelsPerSecond,
  characterCount,
}) => {
  const timeRange = endTime - startTime;
  const rulerWidth = timeRange * pixelsPerSecond;
  const rulerHeight = characterCount * 80; // 80 is h-20 for each track

  const lines = [];
  const tickLevel = getTickLevel(pixelsPerSecond);

  let currentTime = startTime;
  const startDate = secondsToDate(startTime);

  switch (tickLevel) {
    case "decade":
      currentTime = dateToSeconds({
        year: Math.floor(startDate.year / 10) * 10,
        month: 1,
        day: 1,
      });
      while (currentTime < endTime) {
        lines.push((currentTime - startTime) * pixelsPerSecond);
        const currentYear = secondsToDate(currentTime).year;
        currentTime = dateToSeconds({ year: currentYear + 10, month: 1, day: 1 });
      }
      break;
    case "year":
      currentTime = dateToSeconds({ year: startDate.year, month: 1, day: 1 });
      while (currentTime < endTime) {
        lines.push((currentTime - startTime) * pixelsPerSecond);
        const currentYear = secondsToDate(currentTime).year;
        currentTime = dateToSeconds({ year: currentYear + 1, month: 1, day: 1 });
      }
      break;
    case "month":
      currentTime = dateToSeconds({
        year: startDate.year,
        month: startDate.month,
        day: 1,
      });
      while (currentTime < endTime) {
        lines.push((currentTime - startTime) * pixelsPerSecond);
        let { year, month } = secondsToDate(currentTime);
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
        currentTime = dateToSeconds({ year, month, day: 1 });
      }
      break;
    case "day":
      currentTime =
        dateToSeconds({
          year: startDate.year,
          month: startDate.month,
          day: startDate.day,
        }) -
        (dateToSeconds({
          year: startDate.year,
          month: startDate.month,
          day: startDate.day,
        }) %
          SECONDS_PER_DAY);
      while (currentTime < endTime) {
        lines.push((currentTime - startTime) * pixelsPerSecond);
        currentTime += SECONDS_PER_DAY;
      }
      break;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ width: rulerWidth, height: rulerHeight }}
    >
      {/* Vertical grid lines */}
      {lines.map((x, i) => (
        <div
          key={`line-${i}`}
          className="absolute top-0 bottom-0 w-px bg-timeline-grid"
          style={{ left: x }}
        />
      ))}
    </div>
  );
};
