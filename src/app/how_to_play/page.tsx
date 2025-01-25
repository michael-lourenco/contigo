"use client";

import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/icons";
import { Footer } from "@/components/Footer";

export default function HowToPlay() {
  const navigationService = useNavigation();

  const handleBack = () => {
    navigationService.navigateTo("/");
  };

  const possibleNumbers = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 44, 45, 48, 50, 54, 55, 60, 64, 66, 72, 75, 80, 90, 96, 100,
    108, 120, 125, 144, 150, 180,
  ];

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-background">
      <Card className="w-full max-w-3xl bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">
            <Icon name="LuGamepad" className="w-8 h-8" /> Como Jogar
          </CardTitle>
        </CardHeader>
        <CardContent>

          <div className="w-full mb-8">
            <img
              src="/images/how_to_play/how_to_play.png"
              alt="Como jogar Conti Go"
              className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
            />
          </div>

          <p className="text-lg mb-8">
            No <strong>CONTI GO</strong>, você joga contra o relógio (
            <Icon name="LuClock" className="inline w-5 h-5" />) em um tabuleiro (
            <Icon name="LuLayoutGrid" className="inline w-5 h-5" />) 8x8. A cada
            rodada, são sorteados 3 números (
            <Icon name="LuDices" className="inline w-5 h-5" />
            ). Você deve usar operações matemáticas (
            <Icon name="LuPlus" className="inline w-4 h-4" />,{" "}
            <Icon name="LuMinus" className="inline w-4 h-4" />,
            <Icon name="LuX" className="inline w-4 h-4" />,{" "}
            <Icon name="LuDivide" className="inline w-4 h-4" />) para obter um
            número que corresponda a uma casa no tabuleiro. O objetivo é marcar
            todas as casas antes que o tempo (
            <Icon name="LuClock" className="inline w-5 h-5" />) acabe ou antes de
            errar <Icon name="LuHeartCrack" className="inline w-5 h-5" /> três
            vezes. Com 3 vidas (
            <Icon name="LuHeart" className="inline w-5 h-5 text-destructive" />
            ), você deve ser rápido e preciso para vencer!
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Icon name="LuBookOpen" className="w-6 h-6" /> Sobre o Jogo
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Icon name="LuLayoutGrid" className="w-5 h-5" />
                <strong>Gênero:</strong> Jogo de Tabuleiro
              </li>
              <li className="flex items-center gap-2">
                <Icon name="LuMonitor" className="w-5 h-5" />
                <strong>Plataforma:</strong> PC, Android
              </li>
              <li className="flex items-center gap-2">
                <Icon name="LuUser" className="w-5 h-5" />
                <strong>Nº de Jogadores:</strong> 1
              </li>
              <li className="flex items-center gap-2">
                <Icon name="LuUserCircle" className="w-5 h-5" />
                <strong>Idade:</strong> 8+
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Icon name="LuBoxes" className="w-6 h-6" /> Componentes do Jogo
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tabuleiro 8x8 com 64 casas numeradas.</li>
              <li>64 números (veja a relação no final desta explicação).</li>
              <li>
                3 números (<Icon name="LuDices" className="inline w-5 h-5" />)
                sorteados a cada rodada.
              </li>
              <li>
                3 vidas (
                <Icon name="LuHeart" className="inline w-5 h-5 text-destructive" />
                ).
              </li>
              <li>
                Um tempo (<Icon name="LuClock" className="inline w-5 h-5" />)
                principal.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Icon name="LuPlay" className="w-6 h-6" /> Regras do Jogo
            </h2>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>
                São sorteados 3 numeros (
                <Icon name="LuDices" className="inline w-5 h-5" />
                ).
              </li>
              <li>
                O jogador faz operações (
                <Icon name="LuPlus" className="inline w-4 h-4" />,
                <Icon name="LuMinus" className="inline w-4 h-4" />,{" "}
                <Icon name="LuX" className="inline w-4 h-4" />,
                <Icon name="LuDivide" className="inline w-4 h-4" />) com os
                números sorteados para obter um valor.
              </li>
              <li>
                O valor obtido corresponde a uma casa numerada no tabuleiro.
              </li>
              <li>O jogador marca a casa correspondente no tabuleiro.</li>
              <li>
                O tempo (<Icon name="LuClock" className="inline w-5 h-5" />)
                principal continua correndo.
              </li>
            </ol>

            <h4 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Icon name="LuTrophy" className="w-6 h-6" /> Como Ganhar ou Perder
            </h4>
            <p className="mb-2">O jogo pode terminar de três maneiras:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>O jogador marca todas as casas do tabuleiro.</li>
              <li>
                O tempo (<Icon name="LuClock" className="inline w-5 h-5" />)
                principal se esgota.
              </li>
              <li>
                O jogador comete 3 erros (
                <Icon name="LuHeartCrack" className="inline w-5 h-5" />
                ).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Icon name="LuDices" className="w-6 h-6" /> Números possíveis
            </h2>
            <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
              {possibleNumbers.map((number) => (
                <span
                  key={number}
                  className="bg-slate-800 p-2 rounded text-center text-secondary"
                >
                  {number}
                </span>
              ))}
            </div>
          </section>

        </CardContent>
      </Card>
      <Footer />
    </div>
    
  );
}
