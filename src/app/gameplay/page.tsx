"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GameStats } from "@/components/GameStats";
import { DiceExpression } from "@/components/DiceExpression";
import { GridButtons } from "@/components/GridButtons";
import { GameControls } from "@/components/GameControls";
import { GameOverMessage } from "@/components/GameOverMessage";

const AUDIO_URLS = {
  gameStart:
    "https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3",
  wrongAnswer:
    "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3",
  correctAnswer:
    "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
};

const expressions = [
  { before: "", middle1: "+", middle2: "+", after: "" },
  { before: "", middle1: "+", middle2: "-", after: "" },
  { before: "", middle1: "*", middle2: "+", after: "" },
  { before: "(", middle1: "+", middle2: ") *", after: "" },
];

const possibleNumbers = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 44, 45, 48, 50, 54, 55, 60, 64, 66, 72, 75, 80, 90, 96, 100, 108, 120,
  125, 144, 150, 180,
];

export default function ContiGoGame() {
  const [errors, setErrors] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [generalTimer, setGeneralTimer] = useState(180);
  const [roundTimer, setRoundTimer] = useState(0);
  const [diceValues, setDiceValues] = useState(["", "", ""]);
  const [gridValues, setGridValues] = useState<number[]>([]);
  const [authenticatedButtons, setAuthenticatedButtons] = useState<number[]>(
    []
  );
  const [allDisabled, setAllDisabled] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(expressions[0]);
  const [gameOver, setGameOver] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioElements, setAudioElements] = useState<{
    [key: string]: HTMLAudioElement | null;
  }>({
    gameStart: null,
    wrongAnswer: null,
    correctAnswer: null,
  });

  useEffect(() => {
    const loadAudio = async () => {
      const audioPromises = Object.entries(AUDIO_URLS).map(([key, url]) => {
        return new Promise<[string, HTMLAudioElement]>((resolve, reject) => {
          const audio = new Audio(url);
          audio.addEventListener(
            "canplaythrough",
            () => resolve([key, audio]),
            { once: true }
          );
          audio.addEventListener("error", reject);
          audio.load();
        });
      });

      try {
        const loadedAudio = await Promise.all(audioPromises);
        setAudioElements(Object.fromEntries(loadedAudio));
      } catch (error) {
        console.error("Failed to load audio:", error);
      }
    };

    loadAudio();
  }, []);

  const playAudio = useCallback(
    (audioKey: "gameStart" | "wrongAnswer" | "correctAnswer") => {
      if (!muted && audioElements[audioKey]) {
        audioElements[audioKey]!.currentTime = 0;
        audioElements[audioKey]!.play().catch((error) =>
          console.error("Audio playback failed", error)
        );
      }
    },
    [muted, audioElements]
  );

  const generateNewNumbers = useCallback(() => {
    const newDiceValues = Array(3)
      .fill(0)
      .map(() => Math.floor(Math.random() * 6) + 1);
    setDiceValues(newDiceValues.map(String));
    setCurrentExpression(
      expressions[Math.floor(Math.random() * expressions.length)]
    );
  }, []);

  const startNewGame = useCallback(() => {
    setErrors(0);
    setSuccesses(0);
    setGeneralTimer(180);
    setRoundTimer(0);
    setGameOver(false);
    generateNewNumbers();
    setGridValues(possibleNumbers.sort(() => Math.random() - 0.5).slice(0, 64));
    setAuthenticatedButtons([]);
    setAllDisabled(false);
    playAudio("gameStart");
  }, [generateNewNumbers, playAudio]);

  const endGame = useCallback(() => {
    setGameOver(true);
  }, []);

  useEffect(() => {
    if (gameOver) {
      console.log("Game over, timer stopped"); 
      return;
    }

    const timer = setInterval(() => {
      setGeneralTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      setAllDisabled(true);
      console.log("Timer cleared"); 
    };
  }, [gameOver, endGame]);

  const handleGridItemClick = useCallback(
    (value: number) => {
      
      setAllDisabled(true);

      if (gameOver) return;
      

      if (Math.random() > 0.5) {
        setSuccesses((prev) => prev + 1);
        setAuthenticatedButtons((prev) => [...prev, value]);
        playAudio("correctAnswer");
        if (!gameOver) {
            setRoundTimer(1);
            const roundTimerInterval = setInterval(() => {
              setRoundTimer((prev) => {
                if (prev <= 1) {
                  clearInterval(roundTimerInterval);
                  if (!gameOver) {
                    setAllDisabled(false);
                    generateNewNumbers();
                  }
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
        }
      } else {
        setErrors((prev) => {
          if (prev + 1 >= 3) {
            endGame();
          } else {
            if (!gameOver) {
                setRoundTimer(1);
                const roundTimerInterval = setInterval(() => {
                  setRoundTimer((prev) => {
                    if (prev <= 1) {
                      clearInterval(roundTimerInterval);
                      if (!gameOver) {
                        setAllDisabled(false);
                        generateNewNumbers();
                      }
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
            }              
          }
          return prev + 1;
        });
        playAudio("wrongAnswer");
      }


    },
    [endGame, generateNewNumbers, playAudio]
  );

  const isAuthenticated = (value: number) =>
    authenticatedButtons.includes(value);
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-slate-900 text-slate-50 p-4">
      <Card className="w-full max-w-4xl bg-slate-800">
        <CardContent className="p-6">
            <GameStats
                errors={errors}
                successes={successes}
                generalTimer={generalTimer}
                roundTimer={roundTimer}
                formatTime={formatTime}
            />
            <DiceExpression diceValues={diceValues} currentExpression={currentExpression} />
            <GridButtons
                gridValues={gridValues}
                isAuthenticated={isAuthenticated}
                handleGridItemClick={handleGridItemClick}
                allDisabled={allDisabled}
            />
            <GameControls
                gameOver={gameOver}
                startNewGame={startNewGame}
                generateNewNumbers={generateNewNumbers}
                muted={muted}
                toggleMute={() => setMuted(!muted)}
            />
            <GameOverMessage gameOver={gameOver} />
        </CardContent>
      </Card>
    </div>
  );
}
