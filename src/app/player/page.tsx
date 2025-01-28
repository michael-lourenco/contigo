"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserInfo } from "@/components/UserInfo";
import { PlayerStatistics } from "@/components/player/PlayerStatistics";
import { useNavigation } from "@/hooks/useNavigation";
import { MatchHistory } from "@/components/player/MatchHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { UserLogout } from "@/components/UserLogout";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PlayerDashboard() {

  const { user, loading, status, handleLogin, handleLogout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
          <UserInfo
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
          <Card className="bg-background border-none shadow-none">
            <CardContent className="border-none shadow-none">
              {status === "loading" ? (
                <p>Loading...</p>
              ) : (
                <>
                  <PlayerStatistics
                    user={user}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                  />
                  <MatchHistory
                    matchHistory={
                      user?.match_history?.map((match) => ({
                        ...match,
                        id: String(match.id),
                        date:
                          match.date instanceof Date
                            ? match.date.toISOString()
                            : match.date,
                      })) || null
                    }
                  />
                  <UserLogout
                    user={user}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                  />
                </>

              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
