"use client";

import { useState } from "react";

const SIZES = ["S", "M", "L", "XL"] as const;

export interface SizePickerProps {
    className?: string;
}

const SizePicker = ({className = ""}: SizePickerProps) => {
    const [selected, setSelected] = useState<string | null>(null);
    
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
        <div className="flex items-center justify-between">
            <p className="text-xl font-medium text-dark">Size</p>
            <button className="text-text-dark-muted  underline-offset-2 underline hover:cursor-pointer ">
                Size Guide
            </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
            {SIZES.map((size) => {
                const isActive = selected === size;
                
                return (
                    <button
                        key={size}
                        onClick={() => setSelected(isActive ? null : size)}
                        className={`rounded-sm border border-muted-foreground py-3 text-center text-body font-medium transition hover:cursor-pointer hover:bg-dark hover:text-text-light ${
                        isActive ? "border-dark-900 text-dark-900 bg-dark text-text-light " : ""
                    }`}
                    aria-pressed={isActive}>
                        {size}
                    </button>
                )
            })}
        </div>
    </div>
  )
}

export default SizePicker