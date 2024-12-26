import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, Clock, XCircle, Coins } from 'lucide-react';

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const mockMatchHistory = [
  {
    id: 1,
    date: new Date('2024-03-25T14:30:00'),
    score: 850,
    errors: 2,
    duration: '4:30',
  },
  {
    id: 2,
    date: new Date('2024-03-24T16:15:00'),
    score: 920,
    errors: 1,
    duration: '5:15',
  },
  {
    id: 3,
    date: new Date('2024-03-23T10:45:00'),
    score: 760,
    errors: 4,
    duration: '3:45',
  },
];

export default function PlayerDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Player Profile */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src="/api/placeholder/150/150" alt="Player avatar" />
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">Michael Player</CardTitle>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">920</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coins</CardTitle>
              <Coins className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,450</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Match History */}
      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Score</th>
                  <th scope="col" className="px-6 py-3">Errors</th>
                  <th scope="col" className="px-6 py-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {mockMatchHistory.map((match) => (
                  <tr key={match.id} className="border-b">
                    <td className="px-6 py-4">{formatDate(match.date)}</td>
                    <td className="px-6 py-4 font-medium">{match.score}</td>
                    <td className="px-6 py-4">{match.errors}</td>
                    <td className="px-6 py-4">{match.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}