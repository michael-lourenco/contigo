// src/app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendLeaderboardToGamification } from '@/services/firebase/FirebaseService';

export async function POST(request: NextRequest) {
  try {
    await sendLeaderboardToGamification();
    return NextResponse.json({ message: 'Leaderboard updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}