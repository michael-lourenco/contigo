// components/player/MatchHistory.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Match {
  id: string;
  date: string;
  score: number;
  errors: number;
  duration: string;
}

interface MatchHistoryProps {
  matchHistory: Match[] | null;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const MatchHistory: React.FC<MatchHistoryProps> = ({ matchHistory }) => {
  return (
    <Card className="bg-slate-900 text-slate-50">
      <CardHeader className="bg-slate-900 text-slate-50">
        <CardTitle className="bg-slate-900 text-slate-50">Match History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto bg-slate-900 text-slate-50">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted bg-slate-900 text-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Score</th>
                <th scope="col" className="px-6 py-3">Errors</th>
                <th scope="col" className="px-6 py-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {matchHistory
                ? matchHistory.map((match) => (
                    <tr key={match.id} className="border-b">
                      <td className="px-6 py-4">{formatDate(new Date(match.date))}</td>
                      <td className="px-6 py-4 font-medium">{match.score}</td>
                      <td className="px-6 py-4">{match.errors}</td>
                      <td className="px-6 py-4">{match.duration}</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
