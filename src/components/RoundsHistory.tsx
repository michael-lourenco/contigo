import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon, IconName } from "./icons";

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
    return null;
  }

  // Header items with their respective icons and mobile-friendly labels
  const headerItems = [
    { icon: "LuHash", label: "Rodada", mobileLabel: "#" },
    { icon: "LuDices", label: "Dado 1", mobileLabel: "D1" },
    { icon: "LuDices", label: "Dado 2", mobileLabel: "D2" },
    { icon: "LuDices", label: "Dado 3", mobileLabel: "D3" },
    { icon: "LuMousePointer", label: "Escolha", mobileLabel: "Esc" },
    { icon: "LuTimer", label: "Tempo", mobileLabel: "T(s)" },
    { icon: "LuTarget", label: "Resultado", mobileLabel: "R" },
    { icon: "LuCalendar", label: "Data", mobileLabel: "Data" },
  ];

  return (
    <>
      <Button 
        onClick={toggleTableVisibility} 
        className="border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-slate-900"
      >
        <Icon name="LuBookOpen" size={20} />
      </Button>

      {isTableVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-100 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsTableVisible(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-slate-900 text-slate-50 rounded-lg shadow-xl mt-4 sm:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-slate-900 text-slate-50">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Icon name="LuHistory" size={24} />
                  Histórico de Rodadas
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTableVisibility}
                  className="ml-auto p-2"
                >
                  <Icon name="LuX" size={20} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        {headerItems.map((item, index) => (
                          <TableHead 
                            key={index}
                            className="text-left p-2 sm:p-4 whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Icon name={item.icon as IconName} size={16} className="text-slate-400" />
                              <span className="hidden sm:inline">{item.label}</span>
                              <span className="sm:hidden">{item.mobileLabel}</span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roundsData.map((round, index) => (
                        <TableRow key={index} className="hover:bg-slate-800/50">
                          <TableCell className="p-2 sm:p-4">{index + 1}</TableCell>
                          <TableCell className="p-2 sm:p-4">{round.dice_1}</TableCell>
                          <TableCell className="p-2 sm:p-4">{round.dice_2}</TableCell>
                          <TableCell className="p-2 sm:p-4">{round.dice_3}</TableCell>
                          <TableCell className="p-2 sm:p-4">{round.choosed_value}</TableCell>
                          <TableCell className="p-2 sm:p-4">{round.time}</TableCell>
                          <TableCell className="p-2 sm:p-4">
                            <Badge 
                              variant={round.success ? "default" : "destructive"}
                              className="whitespace-nowrap"
                            >
                              {round.success ? (
                                <span className="flex items-center gap-1">
                                  <Icon name="LuCheckCircle" size={14} />
                                  <span className="hidden sm:inline">Sucesso</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Icon name="LuXCircle" size={14} />
                                  <span className="hidden sm:inline">Erro</span>
                                </span>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4">
                            {new Date(round.createdAt).toLocaleDateString()}
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