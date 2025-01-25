import { useState, useEffect } from "react";
import {
  findFirstByOwnerAndDate,
  Leaderboard,
  PlayerData,
} from "@/services/gamification/LeaderboardAPI";
import { formatDistanceToNow } from "date-fns";
import { Trophy, Medal, Award } from "lucide-react";

type LeaderboardEntry = {
  name: string;
  date: string;
  score: number;
  id: string;
};

export const LeaderboardByOwnerAndDate = () => {
  const [firstLeaderboardByOwnerAndDate, setfindFirstByOwnerAndDate] =
    useState<Leaderboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const gettFirstByOwnerAndDate = async () => {
      try {
        console.log("getfindFirstByOwnerAndDates");
        const data = await findFirstByOwnerAndDate();
        setfindFirstByOwnerAndDate(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch firstLeaderboardByOwnerAndDate",
        );
      }
    };

    gettFirstByOwnerAndDate();
  }, []);

  if (error)
    return (
      <div className="text-destructive text-center p-4 rounded-lg bg-slate-800">
        Error: {error}
      </div>
    );

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2">
      <div className="rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-background">
          <h2 className="text-xl font-bold text-primary">
            {firstLeaderboardByOwnerAndDate?.name || "Leaderboard"}
          </h2>
          {firstLeaderboardByOwnerAndDate?.description && (
            <p className="text-primary mt-1">
              {firstLeaderboardByOwnerAndDate.description}
            </p>
          )}
        </div>

        <div className="divide-y divide-background">
          {firstLeaderboardByOwnerAndDate?.leaderboard?.map(
            (entry: PlayerData, index: number) => (
              <div
                key={entry.id}
                className="flex items-center p-4 hover:bg-background transition-colors"
              >
                <div className="flex items-center space-x-4 w-full">
                  <span className="w-8 text-center font-bold text-primary">
                    {getRankIcon(index) || `#${index + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg items-center font-semibold text-primary">
                      {entry.name}
                    </p>
                    {/* <p className="text-sm text-primary">
                      .{" "} */}
                      {/* {formatDistanceToNow(new Date(entry.date), { addSuffix: true })} */}
                    {/* </p> */}
                  </div>
                  <div className="flex flex-col items-center ml-auto">
                    <span className="text-xl font-bold text-primary text-yellow-400">
                      {entry.score}
                    </span>
                    <p className="text-xs text-primary">points</p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {(!firstLeaderboardByOwnerAndDate?.leaderboard ||
          firstLeaderboardByOwnerAndDate.leaderboard.length === 0) && (
          <div className="p-8 text-center text-primary">
            No scores recorded yet
          </div>
        )}
      </div>
    </div>
  );
};
