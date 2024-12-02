 // components/LeaderboardsList.tsx
 import { useState, useEffect } from 'react';
 import { fetchLeaderboards,Leaderboard } from '@/services/gamification/LeaderboardAPI';
 
 export const LeaderboardsList = () => {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const getLeaderboards = async () => {
      try {
        console.log("getLeaderboards")
        const data = await fetchLeaderboards();
        setLeaderboards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboards');
      }
    };
    
    getLeaderboards();
  }, []);
 
  if (error) return <div>Error: {error}</div>;
 
  return (
    <div>
      {leaderboards.map((leaderboard) => (
        <div key={leaderboard.id}>
          <h2>{leaderboard.name}</h2>
          <p>{leaderboard.description}</p>
          {/* Render other leaderboard data */}
        </div>
      ))}
    </div>
  );
 };