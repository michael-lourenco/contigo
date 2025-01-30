"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGemini } from "@/hooks/useGemini";
import { UserInfo } from "@/components/UserInfo";
import { PlayerStatistics } from "@/components/player/PlayerStatistics";
import { History } from "@/components/player/History";
import {
  updateHistory,
  updateUserCredits,
  dbFirestore,
} from "@/services/firebase/FirebaseService";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { UserLogout } from "@/components/UserLogout";
import { BookInfo } from "@/components/BookInfo";
import { BookControls } from "@/components/BookControls";
import { Button } from "@/components/ui/button";
export default function Book() {
  const { user, loading, status, handleLogin, handleLogout } = useAuth();

  const [generateContent, setGenerateContent] = useState<boolean>(false);
  // Prompt predefinido (substitua pelo que você deseja)
  const prompt = "Crie uma história curta e envolvente, com no máximo 2000 caracteres, perfeita para um pai ou mãe ler para seu filho antes de dormir. A história deve ser mágica, aconchegante e transmitir uma mensagem positiva, como coragem, amizade ou gentileza. O tom deve ser leve e encantador, adequado para crianças pequenas. Inclua um protagonista carismático, um pequeno desafio e um final feliz que deixe uma sensação de conforto e alegria.Retorne o texto formatado em HTML puro, com tags <h2> para o título, <p> para os parágrafos e <strong> para palavras importantes. Não inclua código React, JSX ou scripts, apenas o HTML da história.";
  
  const { response } = useGemini(prompt, generateContent);

  const endRead = useCallback(() => {

    queueMicrotask(async () => {
      if (!user) return;

      const now = new Date();
      if(user.credits.value > 0) {
        await updateHistory(user.email, {
          date: now,
          prompt: prompt,
          history: response ? response : "Sem resposta",
        }, dbFirestore);
  
        await updateUserCredits(user.email, -1, dbFirestore);        
      } else {
        console.log("New credit is not done. No update performed.");
      }

      });

  }, [prompt, response, user]);


  const handleSaveClick = useCallback(
    () => {
      endRead();
    },
    [endRead],
  );

  const handleGenerateBook = useCallback(
    () => {
      setGenerateContent(true);
    },
    [generateContent],
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
          <UserInfo
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />

          {/* O prompt já está definido e a resposta será carregada automaticamente */}
          <Button
            variant="outline"
            className="border-chart-2 text-chart-2 hover:bg-chart-2 hover:text-primary"
            onClick={handleGenerateBook}
          >
            
            história do dia
          </Button>
          <BookInfo prompt={prompt} response={response} user={user}             handleLogin={handleLogin}
            handleLogout={handleLogout} />
          <BookControls
                    handleSaveClick={handleSaveClick}
                  />
          <Card className="bg-background border-none shadow-none">
            <CardContent className="border-none shadow-none">
              {status === "loading" ? (
                <p>Loading...</p>
              ) : (
                <>
                  <History
                    historyData={
                      user?.history?.map((history) => ({
                        ...history,
                        id: history.id,
                        date:
                          history.date instanceof Date
                            ? history.date.toISOString()
                            : history.date,
                      })) || null
                    }
                  />

                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
