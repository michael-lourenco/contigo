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
  <div className="grid grid-cols-8 gap-2 mb-6">
    {gridValues.map((value, index) => (
      <Button
        key={index}
        variant="outline"
        className={`grid-item ${isAuthenticated(value) ? "authenticated" : ""}`}
        onClick={() => handleGridItemClick(value)}
        disabled={allDisabled || isAuthenticated(value)}
      >
        {value}
      </Button>
    ))}
  </div>
);
