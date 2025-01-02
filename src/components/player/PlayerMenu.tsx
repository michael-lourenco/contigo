import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerMenuButton } from "./PlayerMenuButton";

export interface PlayerMenuProps {
  onPlay: () => void;
  onSettings: () => void;
  onHowToPlay: () => void;
}

export const PlayerMenu: React.FC<PlayerMenuProps> = ({
  onPlay,
  onSettings,
  onHowToPlay,
}) => (
  <Card className="fixed bottom-0 left-0 right-0 bg-slate-900 p-0 m-0">
    <CardContent className="flex flex-row justify-center space-x-4 py-4">
      <PlayerMenuButton label="Jogar" onClick={onPlay} />
      <PlayerMenuButton label="Configurações" onClick={onSettings} />
      <PlayerMenuButton label="Como Jogar" onClick={onHowToPlay} />
    </CardContent>
  </Card>
);

export default PlayerMenu;
