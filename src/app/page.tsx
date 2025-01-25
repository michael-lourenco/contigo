'use client';
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, HelpCircle, Heart } from "lucide-react";
import { Icon } from "@/components/icons";
import { LeaderboardByOwnerAndDate } from "@/components/leaderboard/Leaderboard";
import { HomeUserInfo } from "@/components/HomeUserInfo";
import { useNavigation } from "@/hooks/useNavigation";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";

export default function Home() {
  const navigationService = useNavigation();
  const { user, loading, status, handleLogin, handleLogout } = useAuth();
  
  const handleNavigation = (path: string) => () => {
    navigationService.navigateTo(path);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-pulse text-slate-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* User Info Section */}
        {status !== "loading" && (
          <div className="mb-8">
            <HomeUserInfo
              user={user}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
            />
          </div>
        )}

        {/* Main Game Section */}
        <Card className="bg-slate-900">
          <CardHeader className="space-y-2">
            <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-lime-400 to-green-500 text-transparent bg-clip-text">
              Conti GO
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Play Button - Featured */}
            <div className="flex justify-center">
              <Button
                onClick={handleNavigation("/gameplay")}
                className="w-32 h-32 rounded-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400 shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Play className="w-16 h-16 text-slate-900" />
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="space-y-4">
              {/* How to Play */}
              <Button
                onClick={handleNavigation("/how_to_play")}
                variant="ghost"
                className="w-full group transition-all duration-300 hover:bg-slate-800"
              >
                <HelpCircle className="w-5 h-5 mr-2 text-slate-400 group-hover:text-lime-500" />
                <span className="text-slate-300 group-hover:text-lime-500">Como Jogar</span>
              </Button>

              {/* Support Button */}
              <Button
                onClick={() => window.open("https://buy.stripe.com/00g02GeSnaJC12g5kk", "_blank")}
                variant="outline"
                className="w-full border-chart-4/50 text-purple-400 hover:bg-chart-4/10 hover:border-purple-400 group transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2 text-chart-4 group-hover:text-purple-400" />
                <span>Apoiar o Projeto</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Section */}
        <div className="mt-8">
          <LeaderboardByOwnerAndDate />
        </div>
      </div>
      <Footer />
    </div>
  );
}