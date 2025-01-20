import React, { useEffect, useState } from "react";
import { UserData } from "@/services/auth/NextAuthenticationService";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Coins } from "lucide-react";

interface PlayerStatisticsProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const PlayerStatistics: React.FC<PlayerStatisticsProps> = ({
  user,
  handleLogin,
  handleLogout,
}) => {
  const localStorageUser = localStorage.getItem("user") != null ? localStorage.getItem("user"): {};
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.photoURL) {
      try {
        const cleanPhotoUrl = user.photoURL.split("=")[0];
        setAvatarUrl(`${cleanPhotoUrl}=s150`);
      } catch (error) {
        console.error("Erro ao formatar a URL da imagem:", error);
        setAvatarUrl(null);
      }
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="flex flex-col text-slate-50 mb-4 p-4 bg-slate-800 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-900 text-slate-50">
          {/* Player Profile */}
          <Card className="md:col-span-1 bg-slate-900 text-slate-50">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage
                  src={avatarUrl || "/api/placeholder/150/150"}
                  alt="Player avatar"
                />
                <AvatarFallback>MP</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user?.displayName}</CardTitle>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 text-slate-50">
            <Card className="bg-slate-900 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Best Score
                </CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.best_score?.value ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coins</CardTitle>
                <Coins className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.currency?.value ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Games
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.total_games?.value ?? 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
