import React from 'react';
import { Button } from '@/components/ui/button';
import { UserData } from '@/services/firebase/FirebaseService';
import { Icon } from "./icons";

interface UserInfoProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user, handleLogin, handleLogout }) => {
  return (
    <div className="flex justify-between items-center text-slate-50 mb-4 p-4 bg-slate-800 rounded-lg shadow-lg">
      {user ? (
        <>
          <span className="flex items-center text-lg font-semibold">
            {user.displayName}
            <Icon name="PiTarget" className="w-6 h-6 text-green-500 mx-2" />
            <span className="text-green-300">{user.best_score}</span>
          </span>
          <Button onClick={handleLogout} variant="destructive" className="ml-4">
            Logout
          </Button>
        </>
      ) : (
        <Button onClick={handleLogin} variant="primary" className="w-full">
          Sign in with Google
        </Button>
      )}
    </div>
  );
};
