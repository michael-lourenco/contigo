import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MenuButton } from "./MenuButton";
import { DonationButton } from "./DonationButton";

export interface GameMenuProps {
  onPlay: () => void;
  // onSettings: () => void;
  onHowToPlay: () => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  onPlay,
  // onSettings,
  onHowToPlay,
}) => (
  <Card className="w-full max-w-2xl bg-slate-900 p-0 m-0">
    <CardContent className="flex flex-col space-y-4">
      <MenuButton label="Jogar" onClick={onPlay} />
      {/* <MenuButton label="Configurações" onClick={onSettings} /> */}
      <MenuButton label="Como Jogar" onClick={onHowToPlay} />
      <div className="pt-4">
        <DonationButton stripeUrl="https://buy.stripe.com/00g02GeSnaJC12g5kk" />
      </div>
    </CardContent>
  </Card>
);
