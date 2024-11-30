
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
import { v4 as uuid } from 'uuid'; 

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

export const createLeaderboard = async (): Promise<void> => {
  try {
    const owner = API_KEY?.split('|')[0] ;

    const payload = {
      id: uuid(),
      name: "Ranking Board CONTI GO",
      owner: owner,
      description: "ranking do jogo contigo",
      leaderboard: [
        {
          id: "micsadasda",
          name: "michael",
          score: 10, 
          date: "2024-11-27T09:20:00Z",
        },
        {
          id: "mariasadasda",
          name: "maria",
          score: 12, 
          date: "2024-11-28T09:20:00Z",
        },
      ],
      date: "2024-11-28T09:20:00Z",
    };

    const response = await axios({
      method: 'post',
      url: `${API_URL}/leaderboards/create`,
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      data: payload,
      withCredentials: false,
    });

    console.log('Leaderboard criado com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao criar leaderboard:', error);
    throw error;
  }
};
