import React from "react";

export interface GameplayMenuButtonProps {
  label: React.ReactNode;
  onClick: () => void;
}

export const GameplayMenuButton: React.FC<GameplayMenuButtonProps> = ({
  label,
  onClick,
}) => (
  <button
    className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-white hover:bg-slate-700"
    onClick={onClick}
  >
    {label}
  </button>
);

export default GameplayMenuButton;
