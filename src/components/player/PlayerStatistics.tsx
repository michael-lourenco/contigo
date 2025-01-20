import React, { useEffect, useState } from "react";
import { UserData } from "@/services/auth/NextAuthenticationService";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Coins, GamepadIcon } from "lucide-react";

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

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
    <Card className="bg-slate-800 border-none hover:bg-slate-700 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-slate-50">{value}</div>
          <div className="text-xs text-slate-400">
            {title === "Best Score" && "Personal Record"}
            {title === "Coins" && "Available Balance"}
            {title === "Total Games" && "Games Played"}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="p-6 bg-slate-900 rounded-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Player Profile */}
            <Card className="md:col-span-1 bg-slate-800 border-none">
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="w-24 h-24 border-4 border-slate-700">
                    <AvatarImage
                      src={avatarUrl || "/api/placeholder/150/150"}
                      alt="Player avatar"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-slate-700">
                      {user?.displayName?.charAt(0) || 'MP'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-slate-800"></div>
                </div>
                <CardTitle className="mt-4 text-slate-50 text-xl">
                  {user?.displayName}
                </CardTitle>
                <p className="text-sm text-slate-400">Player Profile</p>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Best Score"
                value={user?.best_score?.value ?? 0}
                icon={Trophy}
                color="bg-amber-500/10 text-amber-500"
              />
              <StatCard
                title="Coins"
                value={user?.currency?.value ?? 0}
                icon={Coins}
                color="bg-emerald-500/10 text-emerald-500"
              />
              <StatCard
                title="Total Games"
                value={user?.total_games?.value ?? 0}
                icon={GamepadIcon}
                color="bg-blue-500/10 text-blue-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PlayerStatistics;