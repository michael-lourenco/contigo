import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "./icons";

export interface Round {
  dice_1: number;
  dice_2: number;
  dice_3: number;
  choosed_value: number;
  time: number;
  success: boolean;
  errors: number;
  createdAt: Date;
}

interface RoundsHistoryProps {
  roundsData: Round[];
}

const RoundsHistory: React.FC<RoundsHistoryProps> = ({ roundsData }) => {
  const [isTableVisible, setIsTableVisible] = useState(false);

  const toggleTableVisibility = () => {
    setIsTableVisible((prev) => !prev);
  };

  if (!roundsData || roundsData.length === 0) {
    return (
        <></>
    );
  }

  return (
    <>
      {/* Botão para abrir a tabela */}
      <Button onClick={toggleTableVisibility} variant="outline" className="flex items-center gap-2 mb-4">
        <Icon name="LuBookOpen" size={20} />
        Histórico
      </Button>

      {/* Tabela sobreposta quando visível */}
      {isTableVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={(e) => {
            // Previne que cliques na tabela fechem o modal.
            e.stopPropagation();
          }}
        >
          <div className="relative w-full max-w-4xl bg-slate-900 text-slate-50 rounded-lg shadow-xl">
            <Card className="bg-slate-900 text-slate-50">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Histórico de Rodadas</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTableVisibility}
                  className="ml-auto"
                >
                  ✖ Fechar
                </Button>
              </CardHeader>
              <CardContent>
                {/* Wrapper para rolagem horizontal em telas menores */}
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">#</TableHead>
                        <TableHead className="text-left">Dado 1</TableHead>
                        <TableHead className="text-left">Dado 2</TableHead>
                        <TableHead className="text-left">Dado 3</TableHead>
                        <TableHead className="text-left">Escolha</TableHead>
                        <TableHead className="text-left">Tempo (s)</TableHead>
                        <TableHead className="text-left">Sucesso</TableHead>
                        <TableHead className="text-left">Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roundsData.map((round, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{round.dice_1}</TableCell>
                          <TableCell>{round.dice_2}</TableCell>
                          <TableCell>{round.dice_3}</TableCell>
                          <TableCell>{round.choosed_value}</TableCell>
                          <TableCell>{round.time}</TableCell>
                          <TableCell>
                            <Badge variant={round.success ? "default" : "destructive"}>
                              {round.success ? "✔️ Sucesso" : "❌ Erro"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(round.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default RoundsHistory;
