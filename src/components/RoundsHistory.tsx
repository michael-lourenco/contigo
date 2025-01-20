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
    { icon: "LuTarget", label: "Resultado", mobileLabel: "R" },
    { icon: "LuTimer", label: "Tempo", mobileLabel: "T(s)" },
  ];

  return (
    <>
      <Button 
        onClick={toggleTableVisibility} 
        className="border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-slate-900"
      >
        <Icon name="LuHistory" size={20} />
      </Button>

      {isTableVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-100 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsTableVisible(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-slate-900 text-slate-50 rounded-lg shadow-xl mt-4 sm:mt-0 border-2 border-slate-500"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-slate-900 text-slate-50">
              <CardHeader className="flex flex-row sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Icon name="LuHistory" size={24} />
                  Jogadas
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
                            className="text-center p-2 sm:p-4 whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Icon name={item.icon as IconName} size={16} className="text-slate-50" />
                              <span className="hidden sm:inline">{item.label}</span>
                              <span className="sm:hidden">{item.mobileLabel}</span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roundsData.map((round, index) => (
                        <TableRow key={index} className="hover:bg-slate-800/50 border-y-2 border-slate-500">
                          <TableCell className="p-2 sm:p-4 text-center">{index + 1}</TableCell>
                          <TableCell className="p-2 sm:p-4 text-center">{round.dice_1}</TableCell>
                          <TableCell className="p-2 sm:p-4 text-center">{round.dice_2}</TableCell>
                          <TableCell className="p-2 sm:p-4 text-center">{round.dice_3}</TableCell>
                          <TableCell className="p-2 sm:p-4 text-center">
                            <Badge 
                              variant={round.success ? "secondary" : "destructive"}
                              className="whitespace-nowrap"
                            >
                              {round.success ? (
                                <span className="flex items-center gap-1">
                                  <Icon name="LuCheckCircle" size={14} />
                                  {round.choosed_value}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Icon name="LuXCircle" size={14} />
                                  {round.choosed_value}
                                </span>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 text-center">{round.time}</TableCell>
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