import React from "react";
import { Button } from "@/components/ui/button";

interface StoryControlsProps {
  handleSaveClick: () => void;
}

export const StoryControls: React.FC<StoryControlsProps> = ({
  handleSaveClick,
}) => (
  <>
  <div className="flex justify-center items-center max-w-full space-x-2 overflow-hidden p-4">

    <Button
      variant="outline"
      className="border-chart-2 text-chart-2 hover:bg-chart-2 hover:text-primary"
      onClick={handleSaveClick}
    >
      Salvar estória
    </Button>
  </div>
  </>
);
