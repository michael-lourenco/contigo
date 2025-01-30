import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "./icons";

interface BookControlsProps {
  handleSaveClick: () => void;
}

export const BookControls: React.FC<BookControlsProps> = ({
  handleSaveClick,
}) => (
  <>
  <div className="flex justify-center items-center max-w-full space-x-2 overflow-hidden p-4">

    <Button
      variant="outline"
      className="border-chart-2 text-chart-2 hover:bg-chart-2 hover:text-primary"
      onClick={handleSaveClick}
    >
      Salvar história
    </Button>
  </div>
  </>
);
