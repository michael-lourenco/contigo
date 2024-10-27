import React from 'react';
import { Button } from '@/components/ui/button';

interface UserInfoProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user, handleLogin, handleLogout }) => {
  return (
    <div className="flex justify-between text-slate-50 mb-4">
      {user ? (
        <>
          <span>{user.displayName} - record - {user.best}</span>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </>
      ) : (
        <Button onClick={handleLogin} variant="default">
          Login com Google
        </Button>
      )}
    </div>
  );
};

