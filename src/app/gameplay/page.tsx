"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { GameStats } from "@/components/GameStats";
import { DiceExpression } from "@/components/DiceExpression";
import { GridButtons } from "@/components/GridButtons";
import { GameControls } from "@/components/GameControls";
import { GameOverMessage } from "@/components/GameOverMessage";
import { calculateService } from "@/services/calculate/CalculateService";
import { useNavigation } from "@/hooks/useNavigation";
import { UserInfo } from "@/components/UserInfo";
import {
  Round,
  updateUserBestScore,
  updateUserCurrency,
  updateUserTotalGames,
  updateMatchHistory,
  dbFirestore,
} from "@/services/firebase/FirebaseService";
import GameplayMenu from "@/components/gameplay/GameplayMenu";
import RoundsHistory from "@/components/RoundsHistory";
import { Footer } from "@/components/Footer";

const AUDIO_URLS = {
  gameStart:
    "https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3",
  wrongAnswer:
    "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3",
  correctAnswer:
    "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
};

const possibleNumbers = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 44, 45, 48, 50, 54, 55, 60, 64, 66, 72, 75, 80, 90, 96, 100, 108, 120,
  125, 144, 150, 180,
];

export default function ContiGoGame() {
  const navigationService = useNavigation();
  const { user, handleLogin, handleLogout } = useAuth();
  const handleNavigation = (path: string) => () => {
    navigationService.navigateTo(path);
  };


  const [errors, setErrors] = useState(3);
  const [successes, setSuccesses] = useState(0);
  const [generalTimer, setGeneralTimer] = useState(180);
  const [roundTimer, setRoundTimer] = useState(0);
  const [diceValues, setDiceValues] = useState(["", "", ""]);
  const [gridValues, setGridValues] = useState<number[]>([]);
  const [remainNumbers, setRemainNumbers] = useState<number[]>([]);
  const [authenticatedButtons, setAuthenticatedButtons] = useState<number[]>(
    [],
  );
  const [allDisabled, setAllDisabled] = useState(false);
  const [showExpressions, setShowExpressions] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioElements, setAudioElements] = useState<{
    [key: string]: HTMLAudioElement | null;
  }>({
    gameStart: null,
    wrongAnswer: null,
    correctAnswer: null,
  });
  const [rounds, setRounds] = useState<Round[]>([]);

  function removeNumber(num: number, remainNumbers: number[]) {
    const index = remainNumbers.indexOf(num);
    if (index !== -1) {
      setRemainNumbers(remainNumbers.filter((_, i) => i !== index));
    } else {
      console.log(`Number ${num} not found in array.`);
    }
  }

  function verifyNumbers(remainNumbers: number[]) {
    for (let i = 0; i < remainNumbers.length; i++) {
      const result = calculateService.resolve(
        parseInt(diceValues[0]),
        parseInt(diceValues[1]),
        parseInt(diceValues[2]),
        remainNumbers[i],
      );
      if (result.valueFound) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    const loadAudio = async () => {
      const audioPromises = Object.entries(AUDIO_URLS).map(([key, url]) => {
        return new Promise<[string, HTMLAudioElement]>((resolve, reject) => {
          const audio = new Audio(url);
          audio.addEventListener(
            "canplaythrough",
            () => resolve([key, audio]),
            { once: true },
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
          console.error("Audio playback failed", error),
        );
      }
    },
    [muted, audioElements],
  );

  const generateNewNumbers = useCallback(() => {
    const newDiceValues = Array(3)
      .fill(0)
      .map(() => Math.floor(Math.random() * 6) + 1);
    setDiceValues(newDiceValues.map(String));
    setShowExpressions(true);
  }, []);

  const startNewGame = useCallback(() => {
    setRounds([]);
    setErrors(3);
    setSuccesses(0);
    setGeneralTimer(180);
    setIsPlaying(true);
    setRoundTimer(0);
    setGameOver(false);
    generateNewNumbers();
    setGridValues(possibleNumbers.sort(() => Math.random() - 0.5).slice(0, 64));
    setAuthenticatedButtons([]);
    setRemainNumbers(possibleNumbers);
    setAllDisabled(false);
    playAudio("gameStart");
  }, [generateNewNumbers, playAudio]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);

    queueMicrotask(async () => {
      if (!user) return;

      const userScore = user.best_score?.value || 0;
      const newCurrency = (user.currency?.value || 0) + successes;
      const now = new Date();

      await updateUserCurrency(user.email, successes, dbFirestore);

      await updateUserTotalGames(user.email, 1, dbFirestore);
      await updateMatchHistory(user.email, {
        date: now,
        score: successes,
        errors: errors,
        duration: generalTimer.toString(),
        rounds: rounds,
      }, dbFirestore);

      if (successes > userScore) {
        await updateUserBestScore(user.email, successes, dbFirestore);
        // setUser((prev) => {
        //   if (!prev) return null;
        //   return {
        //     ...prev,
        //     best_score: {
        //       value: successes,
        //       updatedAt: now,
        //     },
        //   };
        // });
      }

      // setUser((prev) => {
      //   if (!prev) return null;
      //   return {
      //     ...prev,
      //     currency: {
      //       value: newCurrency,
      //       updatedAt: now,
      //     },
      //   };
      // });
    });
  }, [successes, user]);

  useEffect(() => {
    if (gameOver || !isPlaying) {
      return;
    }

    const timer = setInterval(() => {
      if (!isPlaying) return;
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
    };
  }, [gameOver, endGame, isPlaying]);

  const handleGridItemClick = useCallback(
    (value: number) => {
      setAllDisabled(true);

      if (gameOver) return;

      const result = calculateService.resolve(
        parseInt(diceValues[0]),
        parseInt(diceValues[1]),
        parseInt(diceValues[2]),
        value,
      );

      if (result.valueFound) {
        setRounds([...rounds,{
          dice_1: parseInt(diceValues[0]),
          dice_2: parseInt(diceValues[1]),
          dice_3: parseInt(diceValues[2]),
          choosed_value: value,
          time: generalTimer,
          success: result.valueFound,
          errors: errors,
          createdAt: new Date(),
        }]);
        setSuccesses((prev) => prev + 1);
        setAuthenticatedButtons((prev) => [...prev, value]);
        removeNumber(value, remainNumbers);

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
        setRounds([...rounds,{
          dice_1: parseInt(diceValues[0]),
          dice_2: parseInt(diceValues[1]),
          dice_3: parseInt(diceValues[2]),
          choosed_value: value,
          time: generalTimer,
          success: result.valueFound,
          errors: errors,
          createdAt: new Date(),
        }]);
        setErrors((prev) => {
          if (prev - 1 <= 0) {
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
          return prev - 1;
        });
        playAudio("wrongAnswer");
      }
    },
    [diceValues, endGame, generateNewNumbers, playAudio],
  );

  const handleSkipClick = useCallback(() => {
    setAllDisabled(true);

    if (gameOver) return;

    const resultExists = verifyNumbers(remainNumbers);

    if (!resultExists) {
      
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
        if (prev - 1 <= 0) {
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
        return prev - 1;
      });
      playAudio("wrongAnswer");
    }
  }, [diceValues, endGame, generateNewNumbers, playAudio]);

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
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
          <UserInfo
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
          <Card className="bg-background border-none shadow-none">
            <CardContent className="border-none shadow-none">
              <GameStats
                errors={errors}
                successes={successes}
                generalTimer={generalTimer}
                formatTime={formatTime}
              />
              <DiceExpression
                diceValues={diceValues}
                showExpressions={showExpressions}
              />
              <GridButtons
                gridValues={gridValues}
                isAuthenticated={isAuthenticated}
                handleGridItemClick={handleGridItemClick}
                allDisabled={allDisabled}
              />
              <GameControls
                gameOver={gameOver}
                startNewGame={startNewGame}
                handleSkipClick={handleSkipClick}
                muted={muted}
                toggleMute={() => setMuted(!muted)}
                rounds={rounds}
              />
              <GameOverMessage gameOver={gameOver} />
            </CardContent>
          </Card>
          {/* <GameplayMenu
            onDashboard={handleNavigation("/player")}
            // onSettings={handleNavigation("/settings")}
            onHowToPlay={handleNavigation("/how_to_play")}
          /> */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
