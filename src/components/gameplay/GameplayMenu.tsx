import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GameplayMenuButton } from "./GameplayMenuButton";
import { Icon } from "@/components/icons";

export interface GameplayMenuProps {
  onDashboard: () => void;
  // onSettings: () => void;
  onHowToPlay: () => void;
}

export const GameplayMenu: React.FC<GameplayMenuProps> = ({
  onDashboard,
  // onSettings,
  onHowToPlay,
}) => (
  <Card className="bottom-0 left-0 right-0 bg-slate-900 p-0 m-0">
    <CardContent className="flex flex-row justify-center space-x-4 py-4">
      <GameplayMenuButton
        label={<Icon name="LuUser" size={24} />}
        onClick={onDashboard}
      />
      {/* <GameplayMenuButton
        label={<Icon name="LuSettings" size={24} />}
        onClick={onSettings}
      /> */}
      <GameplayMenuButton
        label={<Icon name="LuInfo" size={24} />}
        onClick={onHowToPlay}
      />
    </CardContent>
  </Card>
);

export default GameplayMenu;
