import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserData } from '@/services/firebase/FirebaseService';
import { Heart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, Coins } from 'lucide-react';

interface PlayerStatisticsProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const PlayerStatistics: React.FC<PlayerStatisticsProps> = ({ user, handleLogin, handleLogout }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.photoURL) {
      try {
        // Remove parâmetros desnecessários e ajusta o tamanho
        const cleanPhotoUrl = user.photoURL.split('=')[0];
        setAvatarUrl(`${cleanPhotoUrl}=s150`);
      } catch (error) {
        console.error('Erro ao formatar a URL da imagem:', error);
        setAvatarUrl(null); // Fallback caso algo dê errado
      }
    } else {
      setAvatarUrl(null); // Fallback para quando não houver foto
    }
  }, [user]);

  const handleDonation = () => {
    window.open('https://buy.stripe.com/00g02GeSnaJC12g5kk', '_blank');
  };

  return (
    <div className="flex flex-col text-slate-50 mb-4 p-4 bg-slate-800 rounded-lg shadow-lg">
      {user ? (
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
              <CardTitle className="mt-4">{user.displayName}</CardTitle>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 text-slate-50">
            <Card className="bg-slate-900 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.best_score?.value ?? 0}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coins</CardTitle>
                <Coins className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.currency?.value ?? 0}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-slate-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Games</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.total_games?.value ?? 0}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr,auto] items-center gap-2">
          <Button onClick={handleLogin} variant="default">
            Sign in with Google
          </Button>
          <Button
            onClick={handleDonation}
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-slate-900 flex items-center gap-2 whitespace-nowrap"
          >
            <Heart className="w-4 h-4" />
            Apoiar
          </Button>
        </div>
      )}
    </div>
  );
};
