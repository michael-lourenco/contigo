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
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-50">
            {firstLeaderboardByOwnerAndDate?.name || "Leaderboard"}
          </h2>
          {firstLeaderboardByOwnerAndDate?.description && (
            <p className="text-slate-400 mt-1">
              {firstLeaderboardByOwnerAndDate.description}
            </p>
          )}
        </div>

        <div className="divide-y divide-slate-700">
          {firstLeaderboardByOwnerAndDate?.leaderboard?.map(
            (entry: PlayerData, index: number) => (
              <div
                key={entry.id}
                className="flex items-center p-4 hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-4 w-full">
                  <span className="w-8 text-center font-bold text-slate-400">
                    {getRankIcon(index) || `#${index + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg items-center font-semibold text-slate-50">
                      {entry.name}
                    </p>
                    {/* <p className="text-sm text-slate-400">
                      .{" "} */}
                      {/* {formatDistanceToNow(new Date(entry.date), { addSuffix: true })} */}
                    {/* </p> */}
                  </div>
                  <div className="flex flex-col items-center ml-auto">
                    <span className="text-xl font-bold text-primary text-yellow-400">
                      {entry.score}
                    </span>
                    <p className="text-xs text-slate-400">points</p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {(!firstLeaderboardByOwnerAndDate?.leaderboard ||
          firstLeaderboardByOwnerAndDate.leaderboard.length === 0) && (
          <div className="p-8 text-center text-slate-400">
            No scores recorded yet
          </div>
        )}
      </div>
    </div>
  );
};
