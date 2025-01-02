import React from "react";
import { Button } from "@/components/ui/button";

export interface GameplayMenuButtonProps {
  label: string;
  onClick: () => void;
}

export const GameplayMenuButton: React.FC<GameplayMenuButtonProps> = ({
  label,
  onClick,
}) => (
  <Button
    className="border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-slate-900"
    variant="outline"
    onClick={onClick}
  >
    {label}
  </Button>
);
