
"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  secondsToDate,
  dateToSeconds,
  getDaysInMonth,
  getDayOfWeek,
} from "@/lib/time";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: number;
  onChange: (value: number) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [date, setDate] = useState(secondsToDate(value));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setDate(secondsToDate(value));
  }, [value]);

  const handleDateChange = (
    newDate: Partial<{ year: number; month: number; day: number }>
  ) => {
    const updatedDate = { ...date, ...newDate };

    if (newDate.year !== undefined || newDate.month !== undefined) {
      const daysInMonth = getDaysInMonth(
        updatedDate.year,
        updatedDate.month - 1
      );
      if (updatedDate.day > daysInMonth) {
        updatedDate.day = daysInMonth;
      }
    }

    setDate(updatedDate);
    onChange(dateToSeconds(updatedDate));
  };

  const handleDayClick = (day: number) => {
    handleDateChange({ day });
    setIsOpen(false);
  };

  const changeMonth = (offset: number) => {
    let { year, month } = date;
    month += offset;

    if (month > 12) {
      month = 1;
      year++;
    } else if (month < 1) {
      month = 12;
      year--;
    }
    handleDateChange({ year, month });
  };

  const formatDate = (date: {
    year: number;
    month: number;
    day: number;
  }) => {
    const { year, month, day } = date;
    return `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
  };

  const renderDayGrid = () => {
    const daysInMonth = getDaysInMonth(date.year, date.month - 1);
    const firstDayOfMonth = getDayOfWeek(date.year, date.month, 1);
    const days = [];

    // In our getDayOfWeek: Sunday is 0, Saturday is 6.
    // We need to adjust if the week starts on a different day. Assuming Sunday start.
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <Button
          key={day}
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0 font-normal",
            date.day === day && "bg-accent text-accent-foreground"
          )}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </Button>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Select
              value={String(date.month)}
              onValueChange={(value) => handleDateChange({ month: Number(value) })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, index) => (
                  <SelectItem key={month} value={String(index + 1)}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              className="w-[80px]"
              value={date.year}
              onChange={(e) =>
                handleDateChange({ year: parseInt(e.target.value) })
              }
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => changeMonth(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {renderDayGrid()}
      </PopoverContent>
    </Popover>
  );
};
