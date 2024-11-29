// types/leaderboard.ts
export interface PlayerData {
  if: string;
  name: string;
  score: number;
  date: Date | null;
}

export interface Leaderboard {
  id: string;
  name: string;
  owner: string;
  description: string;
  leaderboard: PlayerData[];
  date: Date | null;
}

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_GAMIFICATION_API_URL 
const API_KEY = process.env.NEXT_PUBLIC_GAMIFICATION_API_KEY 

export const fetchLeaderboards = async (): Promise<Leaderboard[]> => {
  try {
    const response = await axios({
      method: 'get',
      url: `${API_URL}/leaderboards/list`,
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      withCredentials: false
    });
    
    return response.data.map((item: any) => ({
      ...item,
      date: item.date ? new Date(item.date) : null
    }));
  } catch (error) {
    console.error('Error fetching leaderboards:', error);
    throw error;
  }
};