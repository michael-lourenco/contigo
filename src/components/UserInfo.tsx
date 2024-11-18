import React from 'react';
import { Button } from '@/components/ui/button';
import { UserData } from '@/services/firebase/FirebaseService';
import { Icon } from "./icons";
import { Heart } from "lucide-react";

interface UserInfoProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user, handleLogin, handleLogout }) => {
  const handleDonation = () => {
    window.open('https://buy.stripe.com/00g02GeSnaJC12g5kk', '_blank');
  };

  return (
    <div className="flex flex-col gap-4 text-slate-50 mb-4 p-4 bg-slate-800 rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-between items-center gap-4">
        {user ? (
          <>
            <span className="flex items-center text-lg font-semibold">
              {user.displayName}
              <Icon name="PiTarget" className="w-6 h-6 text-green-500 mx-2" />
              <span className="text-green-300">{user.best_score}</span>
            </span>
            <div className="flex gap-2">
              <Button 
                onClick={handleDonation}
                variant="outline" 
                className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-slate-900 flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Apoiar
              </Button>
              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button onClick={handleLogin} variant="default" className="flex-1">
              Sign in with Google
            </Button>
            <Button 
              onClick={handleDonation}
              variant="outline" 
              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-slate-900 flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Apoiar o Projeto
            </Button>
          </>
        )}
      </div>
    </div>
  );
};