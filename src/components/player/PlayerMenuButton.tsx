import React from "react";

export interface PlayerMenuButtonProps {
  label: React.ReactNode;
  onClick: () => void;
}

export const PlayerMenuButton: React.FC<PlayerMenuButtonProps> = ({
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

export default PlayerMenuButton;
