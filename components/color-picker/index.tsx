"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { ChevronsUpDown } from "lucide-react";
import chroma from "chroma-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const DEFAULT_COLORS = [
  "#64748B",
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
}) => {
  const [internalHex, setInternalHex] = useState(value);

  const hsv = useMemo(() => {
    const hsvColor = chroma(value).hsv();
    if (isNaN(hsvColor[0])) hsvColor[0] = 0;
    return hsvColor;
  }, [value]);

  const svPickerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleSvChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      if (!svPickerRef.current) return;
      const rect = svPickerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      const newSaturation = x / rect.width;
      const newValue = 1 - y / rect.height;
      onChange(chroma.hsv(hsv[0], newSaturation, newValue).hex());
    },
    [hsv, onChange]
  );

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseFloat(e.target.value);
    onChange(chroma.hsv(newHue, hsv[1], hsv[2]).hex());
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setInternalHex(newHex);
    if (chroma.valid(newHex)) {
      onChange(newHex);
    }
  };

  const handleHexBlur = () => {
    if (!chroma.valid(internalHex)) {
      setInternalHex(value);
    }
  };

  const handleDefaultColorClick = (color: string) => {
    onChange(color);
  };

  const hueGradient =
    "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <div className="flex w-full items-center gap-2">
            <div
              className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
              style={{ backgroundColor: value }}
            />
            <div className="flex-1 truncate">{value.toUpperCase()}</div>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 space-y-4">
        <div
          ref={svPickerRef}
          className="w-full h-40 rounded-md cursor-pointer relative"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,1), transparent), linear-gradient(to right, white, ${chroma
              .hsv(hsv[0], 1, 1)
              .hex()})`,
          }}
          onMouseDown={(e) => {
            isDraggingRef.current = true;
            handleSvChange(e);
            
            const handleMouseMove = (e: MouseEvent) => {
              if (isDraggingRef.current) {
                handleSvChange(e);
              }
            };
            const handleMouseUp = () => {
              isDraggingRef.current = false;
              window.removeEventListener("mousemove", handleMouseMove);
              window.removeEventListener("mouseup", handleMouseUp);
            };
        
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
          }}
        >
          <div
            className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md"
            style={{
              left: `${hsv[1] * 100}%`,
              top: `${100 - hsv[2] * 100}%`,
              transform: "translate(-50%, -50%)",
              backgroundColor: value,
            }}
          />
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="360"
            value={hsv[0]}
            onChange={handleHueChange}
            className="w-full h-2 bg-transparent appearance-none cursor-pointer"
            style={{ background: hueGradient, borderRadius: "9999px" }}
          />
          <Input
            value={internalHex.toUpperCase()}
            onChange={handleHexChange}
            onBlur={handleHexBlur}
            className="w-full text-center text-lg font-mono tracking-widest"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Default Colors
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  "w-full h-8 rounded-md border transition-all",
                  value.toUpperCase() === color.toUpperCase()
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "hover:ring-2 hover:ring-primary"
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleDefaultColorClick(color)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
