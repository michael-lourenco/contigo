import React from "react";

interface GameOverMessageProps {
  gameOver: boolean;
}

export const GameOverMessage: React.FC<GameOverMessageProps> = ({
  gameOver,
}) =>
  gameOver ? (
    <div className="mt-4 text-center text-2xl font-bold text-red-500">
      Game Over!
    </div>
  ) : null;