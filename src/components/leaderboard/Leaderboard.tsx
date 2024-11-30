import { useState, useEffect } from 'react';
import { fetchLeaderboards, createLeaderboard, Leaderboard } from '@/services/gamification/api';

export const LeaderboardsList = () => {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeLeaderboards = async () => {
      try {
        console.log("Calling createLeaderboard...");
        await createLeaderboard(); 
        console.log("createLeaderboard completed.");

        console.log("Fetching leaderboards...");
        const data = await fetchLeaderboards();
        setLeaderboards(data);
        console.log("Leaderboards fetched.");
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch or create leaderboards');
      }
    };

    initializeLeaderboards();
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
