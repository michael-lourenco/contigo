import React from "react";

interface DiceExpressionProps {
  diceValues: string[];
  currentExpression: {
    before: string;
    middle1: string;
    middle2: string;
    after: string;
  };
}

export const DiceExpression: React.FC<DiceExpressionProps> = ({
  diceValues,
  currentExpression,
}) => (
  <div className="flex justify-center items-center space-x-2 mb-6">
    <span className="text-2xl font-bold text-lime-500">
      {currentExpression.before}
    </span>
    {diceValues.map((value, index) => (
      <React.Fragment key={index}>
        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-2xl font-bold">
          {value}
        </div>
        {index < 2 && (
          <span className="text-2xl font-bold text-lime-500">
            {index === 0
              ? currentExpression.middle1
              : currentExpression.middle2}
          </span>
        )}
      </React.Fragment>
    ))}
    <span className="text-2xl font-bold text-lime-500">
      {currentExpression.after}
    </span>
  </div>
);
