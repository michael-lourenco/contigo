import React from "react";
import { Button } from "@/components/ui/button";

interface GridButtonsProps {
  gridValues: number[];
  isAuthenticated: (value: number) => boolean;
  handleGridItemClick: (value: number) => void;
  allDisabled: boolean;
}

export const GridButtons: React.FC<GridButtonsProps> = ({
  gridValues,
  isAuthenticated,
  handleGridItemClick,
  allDisabled,
}) => (
  <div className="w-full min-w-[380px] max-w-2xl mx-auto p-2 overflow-x-auto">
    <div className="grid grid-cols-8 gap-2">
      {gridValues.map((value, index) => (
        <Button
          key={index}
          variant="outline"
          className={`w-full aspect-square flex items-center justify-center p-0 text-sm sm:text-base rounded-lg border border-dashed border-slate-500 text-white
            ${isAuthenticated(value) ? "authenticated" : ""}
            hover:bg-slate-700 transition-colors`}
          onClick={() => handleGridItemClick(value)}
          disabled={allDisabled || isAuthenticated(value)}
        >
          {value}
        </Button>
      ))}
    </div>
  </div>
);
