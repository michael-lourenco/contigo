import React, { useEffect, useState } from "react";

const expressions = [
  { before: "", middle1: "", middle2: "", after: "" },
  { before: "", middle1: "+", middle2: "+", after: "" },
  { before: "", middle1: "+", middle2: "-", after: "" },
  { before: "", middle1: "+", middle2: "*", after: "" },
  { before: "", middle1: "+", middle2: "/", after: "" },
  { before: "", middle1: "-", middle2: "+", after: "" },
  { before: "", middle1: "-", middle2: "-", after: "" },
  { before: "", middle1: "-", middle2: "*", after: "" },
  { before: "", middle1: "-", middle2: "/", after: "" },
  { before: "", middle1: "*", middle2: "+", after: "" },
  { before: "", middle1: "*", middle2: "-", after: "" },
  { before: "", middle1: "*", middle2: "*", after: "" },
  { before: "", middle1: "*", middle2: "/", after: "" },
  { before: "", middle1: "/", middle2: "+", after: "" },
  { before: "", middle1: "/", middle2: "-", after: "" },
  { before: "", middle1: "/", middle2: "*", after: "" },
  { before: "", middle1: "/", middle2: "/", after: "" },
  { before: "(", middle1: "+", middle2: ") +", after: "" },
  { before: "(", middle1: "+", middle2: ") -", after: "" },
  { before: "(", middle1: "+", middle2: ") *", after: "" },
  { before: "(", middle1: "+", middle2: ") /", after: "" },
  { before: "(", middle1: "-", middle2: ") +", after: "" },
  { before: "(", middle1: "-", middle2: ") -", after: "" },
  { before: "(", middle1: "-", middle2: ") *", after: "" },
  { before: "(", middle1: "-", middle2: ") /", after: "" },
  { before: "(", middle1: "*", middle2: ") +", after: "" },
  { before: "(", middle1: "*", middle2: ") -", after: "" },
  { before: "(", middle1: "*", middle2: ") *", after: "" },
  { before: "(", middle1: "*", middle2: ") /", after: "" },
  { before: "(", middle1: "/", middle2: ") +", after: "" },
  { before: "(", middle1: "/", middle2: ") -", after: "" },
  { before: "(", middle1: "/", middle2: ") *", after: "" },
  { before: "(", middle1: "/", middle2: ") /", after: "" },
  { before: "", middle1: "+ (", middle2: "+", after: ")" },
  { before: "", middle1: "+ (", middle2: "-", after: ")" },
  { before: "", middle1: "+ (", middle2: "*", after: ")" },
  { before: "", middle1: "+ (", middle2: "/", after: ")" },
  { before: "", middle1: "- (", middle2: "+", after: ")" },
  { before: "", middle1: "- (", middle2: "-", after: ")" },
  { before: "", middle1: "- (", middle2: "*", after: ")" },
  { before: "", middle1: "- (", middle2: "/", after: ")" },
  { before: "", middle1: "* (", middle2: "+", after: ")" },
  { before: "", middle1: "* (", middle2: "-", after: ")" },
  { before: "", middle1: "* (", middle2: "*", after: ")" },
  { before: "", middle1: "* (", middle2: "/", after: ")" },
  { before: "", middle1: "/ (", middle2: "+", after: ")" },
  { before: "", middle1: "/ (", middle2: "-", after: ")" },
  { before: "", middle1: "/ (", middle2: "*", after: ")" },
  { before: "", middle1: "/ (", middle2: "/", after: ")" },
];

interface DiceExpressionProps {
  diceValues: string[];
  quantityExpressionsToShow?: number;
  showExpressions: boolean;
}

export const DiceExpression: React.FC<DiceExpressionProps> = ({
  diceValues,
  quantityExpressionsToShow = 5,
  showExpressions = false,
}) => {
  const [currentExpressionIndex, setCurrentExpressionIndex] = useState(0);
  const [currentIndexToShow, setCurrentIndexToShow] = useState(0);
  const [currentExpression, setCurrentExpression] = useState(expressions[0]);

  const showExpression = () => {
    if (currentIndexToShow < quantityExpressionsToShow) {
      setCurrentExpression(expressions[currentExpressionIndex]);
      const newExpressionIndex = Math.floor(Math.random() * expressions.length);
      const expressionIndex = newExpressionIndex > 0 ? newExpressionIndex : 1;
      setCurrentExpressionIndex(expressionIndex);
      setCurrentIndexToShow((prev) => prev + 1);
    } else {
      setCurrentExpression(expressions[0]);
    }
  };

  useEffect(() => {
    if (!showExpressions || currentIndexToShow > quantityExpressionsToShow)
      return;

    const interval = setInterval(() => {
      showExpression();
    }, 500);

    return () => clearInterval(interval);
  }, [currentIndexToShow, quantityExpressionsToShow, showExpressions]);

  useEffect(() => {
    setCurrentIndexToShow(0);
    setCurrentExpressionIndex(Math.floor(Math.random() * expressions.length));
    showExpression();
  }, [diceValues]);

  return (
    <div className="flex justify-center items-center space-x-2 mb-6 number-boxes">
      <div className="text-2xl font-bold text-lime-500 expression expression-before">
        {currentExpression.before}
      </div>
      <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-2xl font-bold number-box">
        {diceValues[0]}
      </div>
      <div className="text-2xl font-bold text-lime-500 expression expression-middle-1">
        {currentExpression.middle1}
      </div>
      <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-2xl font-bold number-box">
        {diceValues[1]}
      </div>
      <div className="text-2xl font-bold text-lime-500 expression expression-middle-2">
        {currentExpression.middle2}
      </div>
      <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-2xl font-bold number-box">
        {diceValues[2]}
      </div>
      <div className="text-2xl font-bold text-lime-500 expression expression-after">
        {currentExpression.after}
      </div>
    </div>
  );
};
