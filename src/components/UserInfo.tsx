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
    <div className="flex flex-col text-slate-50 mb-4 p-4 bg-slate-800 rounded-lg shadow-lg">
      {user ? (
        <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
          <span className="flex items-center text-lg font-semibold truncate">
            {user.displayName}
            <Icon name="PiTarget" className="w-6 h-6 text-green-500 mx-2 flex-shrink-0" />
            <span className="text-green-300">{user.best_score}</span>
          </span>
          <Button 
            onClick={handleDonation}
            variant="outline" 
            className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-slate-900 flex items-center gap-2 whitespace-nowrap"
            size="sm"
          >
            <Heart className="w-4 h-4" />
            Apoiar
          </Button>
          <Button onClick={handleLogout} variant="destructive" size="sm" className="whitespace-nowrap">
            Logout
          </Button>
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