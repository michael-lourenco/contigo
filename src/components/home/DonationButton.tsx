import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export interface DonationButtonProps {
  stripeUrl: string;
}

export const DonationButton: React.FC<DonationButtonProps> = ({
  stripeUrl,
}) => {
  const handleDonation = () => {
    window.open(stripeUrl, "_blank");
  };

  return (
    <Button
      className="border-chart-4 text-chart-4 hover:bg-chart-4 hover:text-slate-900 flex items-center gap-2"
      variant="outline"
      onClick={handleDonation}
    >
      <Heart className="w-4 h-4" />
      Apoiar o Projeto
    </Button>
  );
};
