import React from "react";
import { Icon } from "./icons";

interface GameStatsProps {
  errors: number;
  successes: number;
  generalTimer: number;
  formatTime: (time: number) => string;
}

export const GameStats: React.FC<GameStatsProps> = ({
  errors,
  successes,
  generalTimer,
  formatTime,
}) => (
  <div className="flex justify-between items-center text-primary mb-4 p-2">
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Icon name="PiHeart" className="w-6 h-6 text-destructive mr-2" />
        <span>{errors}</span>
      </div>
      <div className="flex items-center">
        <Icon name="PiSmiley" className="w-6 h-6 text-green-500 mr-2" />
        <span>{successes}</span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Icon name="PiClock" className="w-6 h-6 mr-2" />
        <span>{formatTime(generalTimer)}</span>
      </div>
    </div>
  </div>
);
