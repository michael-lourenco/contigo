import React from "react";
import { Button } from "@/components/ui/button";
import { UserData } from "@/application/entities/User";
import { Icon } from "./icons";
import { Heart } from "lucide-react";

interface HomeUserInfoProps {
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const HomeUserInfo: React.FC<HomeUserInfoProps> = ({
  user,
  handleLogin,
  handleLogout,
}) => {
  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const handleDonation = () => {
    window.open("https://buy.stripe.com/00g02GeSnaJC12g5kk", "_blank");
  };

  return (
    <div className="rounded-xl overflow-hidden backdrop-blur-sm">
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
          <div className="flex flex-row items-center justify-between min-w-0">
            {/* User Stats - Using min-w-0 to allow truncation */}
            <div className="flex items-center space-x-2 min-w-0">
              <span className="font-semibold truncate min-w-0">
                {user?.displayName}
              </span>
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <Icon
                    name="PiTarget"
                    className="w-5 h-5 text-green-500"
                  />
                  <span className="text-green-400 font-medium">
                    {user?.best_score?.value ?? 0}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon
                    name="PiCoin"
                    className="w-5 h-5 text-green-500"
                  />
                  <span className="text-green-400 font-medium">
                    {user?.currency?.value ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center ml-4 flex-shrink-0">
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              onClick={handleLogin}
              className="w-full sm:w-auto bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500"
            >
              Entrar com Google
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
        </div>
      )}
    </div>
  );
};