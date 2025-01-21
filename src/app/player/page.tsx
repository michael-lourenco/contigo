"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserInfo } from "@/components/UserInfo";
import { PlayerStatistics } from "@/components/player/PlayerStatistics";
import { useNavigation } from "@/hooks/useNavigation";
import { MatchHistory } from "@/components/player/MatchHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";

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
  const navigationService = useNavigation();
  const { user, loading, status, handleLogin, handleLogout } = useAuth();
  const handleNavigation = (path: string) => () => {
    navigationService.navigateTo(path);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-50">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
          <Card className="w-full max-w-2xl bg-slate-900 p-0 m-0">
            <CardContent className="p-2">
              {status === "loading" ? (
                <p>Loading...</p>
              ) : (
                <>
                  <UserInfo
                    user={user}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                  />
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
