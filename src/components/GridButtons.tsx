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
  <div className="w-full max-w-full overflow-hidden">
    <div className="grid grid-cols-8 gap-1 sm:gap-2 px-0 mx-0">
      {gridValues.map((value, index) => (
        <Button
          key={index}
          variant="outline"
          className={`w-full aspect-square flex items-center justify-center p-0 text-xs 
            sm:text-sm md:text-base rounded-lg border border-dashed border-slate-500 text-slate-200
            ${isAuthenticated(value) ? "authenticated border border-dashed border-slate-500 text-white	bg-purple-500 opacity-100" : "border-slate-500"}
            ${!isAuthenticated(value) ? "" : "hover:text-purple-500 hover:bg-slate-200 opacity-100"} transition-colors`}
          onClick={() => handleGridItemClick(value)}
          disabled={allDisabled || isAuthenticated(value)}
        >
          {value}
        </Button>
      ))}
    </div>
  </div>
);
