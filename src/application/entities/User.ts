interface MatchHistoryEntry {
    id: number;
    date: Date;
    score: number;
    errors: number;
    duration: string;
  }
  
  interface BestScoreData {
    value: number;
    updatedAt: Date;
  }
  
  interface CurrencyData {
    value: number;
    updatedAt: Date;
  }
  
  interface BestScore {
    value: number;
    updatedAt: Date;
  }

  interface Credit {
    value: number;
    updatedAt: Date;
  }
  
  interface Currency {
    value: number;
    updatedAt: Date;
  }
  interface FirestoreUser {
    id: string;
    displayName: string;
    email: string;
    best_score?: BestScore;
    currency?: Currency;
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
  interface TotalGamesData {
    value: number;
    updatedAt: Date;
  }
  
 export interface UserData {
    displayName: string;
    best_score: BestScoreData;
    credits: Credit;
    currency: CurrencyData;
    total_games: TotalGamesData;
    email: string;
    match_history?: MatchHistoryEntry[];
    photoURL: string;
  }