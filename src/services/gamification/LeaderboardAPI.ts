export interface PlayerData {
  id: string;
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
  type: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  date: Date;
}

interface LeaderboardPayload {
  id: string;
  name: string;
  owner: string;
  description: string;
  leaderboard: LeaderboardEntry[];
  date: string;
  type: string;
}

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_URL = process.env.NEXT_PUBLIC_GAMIFICATION_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_GAMIFICATION_API_KEY;

export const fetchLeaderboards = async (): Promise<Leaderboard[]> => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}/leaderboards/list`,
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });

    return response.data.map((item: any) => ({
      ...item,
      date: item.date ? new Date(item.date) : null,
    }));
  } catch (error) {
    console.error("Error fetching leaderboards:", error);
    throw error;
  }
};

export const findFirstByOwnerAndDate = async (): Promise<Leaderboard> => {
  try {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    yesterday.setUTCHours(9, 20, 0, 0);

    const date = yesterday.toISOString();

    const response = await axios({
      method: "get",
      url: `${API_URL}/leaderboards/findFirstByOwnerAndDate/${date}`,
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });

    // Transforma o campo `leaderboard.date` em um objeto `Date`
    const transformedData = {
      ...response.data,
      leaderboard: response.data.leaderboard.map((item: any) => ({
        ...item,
        date: item.date ? new Date(item.date) : null,
      })),
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching leaderboards:", error);
    throw error;
  }
};

export const createLeaderboard = async (
  leaderboard: LeaderboardEntry[],
): Promise<void> => {
  try {
    const owner =
      process.env.NEXT_PUBLIC_GAMIFICATION_API_KEY?.split("|")[0] || "";

    const payload: LeaderboardPayload = {
      id: uuidv4(),
      name: "Ranking CONTI GO",
      owner,
      description: "ranking do jogo contigo",
      leaderboard,
      date: new Date().toISOString(),
      type: "SCORE_ORDER_LARGER_IS_BETTER",
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_GAMIFICATION_API_URL}/leaderboards/create`,
      payload,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_GAMIFICATION_API_KEY || "",
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Leaderboard criado com sucesso:", response.data);
  } catch (error) {
    console.error("Erro ao criar leaderboard:", error);
    throw error;
  }
};
