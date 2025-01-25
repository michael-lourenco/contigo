// components/player/MatchHistory.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon, IconName } from "../icons";
interface Match {
  id: string;
  date: string;
  score: number;
  errors: number;
  duration: string;
}

interface MatchHistoryProps {
  matchHistory: Match[] | null;
}

const formatDate: (date: string) => string = (date: string): string => {
  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, 
  }).replace(",", "");
};


const headerItems = [
  { icon: "LuCalendar", label: "Data", mobileLabel: "#" },
  { icon: "LuTarget", label: "Pontuação", mobileLabel: "R" },
  { icon: "LuXCircle", label: "Erros", mobileLabel: "R" },
  { icon: "LuTimer", label: "Duração", mobileLabel: "T(s)" },
];

export const MatchHistory: React.FC<MatchHistoryProps> = ({ matchHistory }) => {
  return (
    <>
      {matchHistory ? (
        <Card className="bg-background text-primary">
          <CardHeader className="bg-background text-primary">
            <CardTitle className="bg-background text-primary">
              Últimas partidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto bg-background text-primary">
            <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        {headerItems.map((item, index) => (
                          <TableHead 
                            key={index}
                            className="text-center p-2 sm:p-4 whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Icon name={item.icon as IconName} size={16} className="text-primary" />
                              <span className="hidden sm:inline">{item.label}</span>
                              <span className="sm:hidden">{item.mobileLabel}</span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matchHistory.map((match, index) => (
                        <TableRow key={index} className="border-y-dashed border-primary border-dashed  hover:bg-popover-foreground hover:text-secondary">
                          <TableCell className="p-2 sm:p-4 text-left">{formatDate(match.date)}</TableCell>
                          <TableCell className="p-2 sm:p-4 text-center">{match.score}</TableCell>
                          <TableCell className="p-2 sm:p-4 text-center">{match.errors}</TableCell>
                          <TableCell className="p-2 sm:p-4 text-center">{match.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
    </>
  );
};
