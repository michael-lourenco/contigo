import React from "react";
import { Button } from "@/components/ui/button";

export interface GameplayMenuButtonProps {
  label: React.ReactNode;
  onClick: () => void;
}

export const GameplayMenuButton: React.FC<GameplayMenuButtonProps> = ({
  label,
  onClick,
}) => (
  <Button
    className="flex items-center justify-centerbg-slate-800 text-white hover:bg-slate-700"
    onClick={onClick}
  >
    {label}
  </Button>
);

export default GameplayMenuButton;
