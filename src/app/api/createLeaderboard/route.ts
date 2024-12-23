import { NextResponse } from "next/server";
import { createLeaderboard } from "@/services/gamification/LeaderboardAPI";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leaderboard } = body;

    // Format the leaderboard entries to match the expected format
    const formattedLeaderboard = leaderboard.map((entry: any) => ({
      id: entry.id,
      name: entry.name,
      score: Number(entry.score),
      date: new Date(entry.date),
    }));

    await createLeaderboard(formattedLeaderboard);

    return NextResponse.json(
      { message: "Leaderboard created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in createLeaderboard API route:", error);
    return NextResponse.json(
      { error: "Failed to create leaderboard" },
      { status: 500 }
    );
  }
}