import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "./icons";
import {
  Round,
} from "@/services/firebase/FirebaseService";
import RoundsHistory from "@/components/RoundsHistory"

interface GameControlsProps {
  gameOver: boolean;
  startNewGame: () => void;
  handleSkipClick: () => void;
  muted: boolean;
  toggleMute: () => void;
  rounds: Round[];
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameOver,
  startNewGame,
  handleSkipClick,
  muted,
  toggleMute,
  rounds,
}) => (
  <>
  <div className="flex justify-center items-center max-w-full space-x-2 overflow-hidden p-6">

    <Button
      onClick={startNewGame}
      className="bg-lime-500 hover:bg-lime-600 text-slate-900"
    >
      <Icon name="PiPlay" className="w-5 h-5 mr-2" />
      {gameOver ? "New" : "New"}
    </Button>
    <Button
      variant="outline"
      className="border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-slate-900"
      onClick={handleSkipClick}
    >
      <Icon name="PiFastForward" className="w-5 h-5 mr-2" />
      Skip
    </Button>
    <Button
      variant="outline"
      className="border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-slate-900"
      onClick={toggleMute}
    >
      {muted ? (
        <Icon name="PiSpeakerSimpleX" className="w-5 h-5" />
      ) : (
        <Icon name="PiSpeakerSimpleLow" className="w-5 h-5" />
      )}
    </Button>
    <RoundsHistory roundsData={rounds} />
  </div>
  </>
);
