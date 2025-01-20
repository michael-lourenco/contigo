"use client";

import { GameMenu } from "@/components/home/GameMenu";
import { LeaderboardByOwnerAndDate } from "@/components/leaderboard/Leaderboard";
import { useNavigation } from "@/hooks/useNavigation";

export default function Home() {
  const navigationService = useNavigation();

  const handleNavigation = (path: string) => () => {
    navigationService.navigateTo(path);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-slate-900 text-slate-50 pt-4">
      <GameMenu
        onPlay={handleNavigation("/gameplay")}
        // onSettings={handleNavigation("/settings")}
        onHowToPlay={handleNavigation("/how_to_play")}
      />
      <LeaderboardByOwnerAndDate />
    </div>
  );
}
