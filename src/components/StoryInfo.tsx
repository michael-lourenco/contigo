import React, { useState, useEffect } from "react";
import { UserData } from "@/application/entities/User";
import { Icon } from "./icons";
import { Card, CardContent } from "@/components/ui/card";

interface StoryInfoProps {
  prompt: string | null;
  response: string | null | HTMLElement | HTMLCollection;
  title: string | null;
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}


export const StoryInfo: React.FC<StoryInfoProps> = ({ prompt, response, title,  handleLogin,
  handleLogout, user }) => {
  const [safeResponse, setSafeResponse] = useState<string>("A estória de hoje será sensacional!");

  const localStorageUser =
  typeof window !== "undefined" && localStorage.getItem("user") !== null
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

  useEffect(() => {
    if (response) {
      if (typeof response === "string") {
        setSafeResponse(response);
      } else if (response instanceof HTMLElement) {
        setSafeResponse(response.innerHTML);
      } else if (response instanceof HTMLCollection) {
        setSafeResponse(Array.from(response).map((el) => el.outerHTML).join(""));
      } else {
        setSafeResponse(String(response)); // Fallback
      }
    }
  }, [response]);
  

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null)  ?  (
        <Card className="mb-4 bg-background text-primary">
          <CardContent>
            <h2 className="text-xl font-bold">
              {title}
            </h2>
            <div
              dangerouslySetInnerHTML={{
                __html: safeResponse,
              }}
              className="mt-2"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col text-primary mb-4 p-4 bg-background rounded-lg text-center">
          <p>Envie uma pergunta para obter uma resposta.</p>
        </div>
      )}
    </>
  );
};
