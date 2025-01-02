import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GameplayMenuButton } from "./GameplayMenuButton";

export interface GameplayMenuProps {
  onDashboard: () => void;
  onSettings: () => void;
  onHowToPlay: () => void;
}

export const GameplayMenu: React.FC<GameplayMenuProps> = ({
  onDashboard,
  onSettings,
  onHowToPlay,
}) => (
  <Card className="fixed bottom-0 left-0 right-0 bg-slate-900 p-0 m-0">
    <CardContent className="flex flex-row justify-center space-x-4 py-4">
      <GameplayMenuButton label="Dashboard" onClick={onDashboard} />
      <GameplayMenuButton label="Configurações" onClick={onSettings} />
      <GameplayMenuButton label="Como Jogar" onClick={onHowToPlay} />
    </CardContent>
  </Card>
);

export default GameplayMenu;
