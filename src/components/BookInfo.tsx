import React, { useState, useEffect } from "react";
import { UserData } from "@/application/entities/User";
import { Icon } from "./icons";


interface BookInfoProps {
  prompt: string | null;
  response: string | null | HTMLElement | HTMLCollection;
  user: UserData | null;
  handleLogin: () => void;
  handleLogout: () => void;
}


export const BookInfo: React.FC<BookInfoProps> = ({ prompt, response,   handleLogin,
  handleLogout, user }) => {
  const [safeResponse, setSafeResponse] = useState<string>("A história de hoje será sensacional!");

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
        <div className="flex flex-col text-primary mb-4 p-4 bg-background rounded-lg shadow-md">
          {/* Exibir a resposta como HTML seguro */}
          <div className="flex items-start gap-2">
            <Icon name="PiBook" className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span
              className="text-base"
              dangerouslySetInnerHTML={{ __html: safeResponse }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col text-primary mb-4 p-4 bg-background rounded-lg text-center">
          <p>Envie uma pergunta para obter uma resposta.</p>
        </div>
      )}
    </>
  );
};
