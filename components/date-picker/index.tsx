
"use client";

import React, { useState, useEffect } from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { secondsToDate, dateToSeconds, getDaysInMonth } from "@/lib/time";

interface DatePickerProps {
  value: number;
  onChange: (value: number) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [date, setDate] = useState(secondsToDate(value));

  useEffect(() => {
    setDate(secondsToDate(value));
  }, [value]);

  const handleDateChange = (field: string, newValue: number) => {
    const newDate = { ...date, [field]: newValue };

    if (field === "year" || field === "month") {
        const daysInMonth = getDaysInMonth(newDate.year, newDate.month - 1);
        if (newDate.day > daysInMonth) {
            newDate.day = daysInMonth;
        }
    }

    setDate(newDate);
    onChange(dateToSeconds(newDate));
  };

  const formatDate = (date: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  }) => {
    const { year, month, day, hour, minute, second } = date;
    return `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year} ${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}:${String(second).padStart(2, "0")}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <div className="flex w-full items-center gap-2">
            <div className="flex-1 truncate">{formatDate(date)}</div>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Input
              type="number"
              value={date.year}
              onChange={(e) => handleDateChange("year", parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Month</label>
            <Input
              type="number"
              min={1}
              max={12}
              value={date.month}
              onChange={(e) =>
                handleDateChange("month", parseInt(e.target.value))
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Day</label>
            <Input
              type="number"
              min={1}
              max={getDaysInMonth(date.year, date.month - 1)}
              value={date.day}
              onChange={(e) => handleDateChange("day", parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hour</label>
            <Input
              type="number"
              min={0}
              max={23}
              value={date.hour}
              onChange={(e) => handleDateChange("hour", parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Minute</label>
            <Input
              type="number"
              min={0}
              max={59}
              value={date.minute}
              onChange={(e) =>
                handleDateChange("minute", parseInt(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Second</label>
            <Input
              type="number"
              min={0}
              max={59}
              value={date.second}
              onChange={(e) =>
                handleDateChange("second", parseInt(e.target.value))
              }
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
