"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemoryGame } from "@/components/games/MemoryGame";
import { MathChallenge } from "@/components/games/MathChallenge";
import { LogicPuzzle } from "@/components/games/LogicPuzzle";
import { WordGame } from "@/components/games/WordGame";

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export function GameCard({
  id,
  title,
  description,
  icon,
  color,
  bgColor,
  borderColor,
}: GameCardProps) {
  const [isGameActive, setIsGameActive] = useState(false);
  const [personalBest, setPersonalBest] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem(`brainSharp${id}Best`) || "0");
    }
    return 0;
  });

  const handleStartGame = () => {
    setIsGameActive(true);
  };

  const handleGameComplete = (score: number) => {
    setIsGameActive(false);
    
    // Update personal best
    if (score > personalBest) {
      setPersonalBest(score);
      if (typeof window !== "undefined") {
        localStorage.setItem(`brainSharp${id}Best`, score.toString());
      }
    }

    // Update total stats
    if (typeof window !== "undefined") {
      const currentTotal = parseInt(localStorage.getItem("brainSharpTotalScore") || "0");
      const currentGames = parseInt(localStorage.getItem("brainSharpGamesPlayed") || "0");
      const currentBest = parseInt(localStorage.getItem("brainSharpBestScore") || "0");
      
      localStorage.setItem("brainSharpTotalScore", (currentTotal + score).toString());
      localStorage.setItem("brainSharpGamesPlayed", (currentGames + 1).toString());
      localStorage.setItem("brainSharpBestScore", Math.max(currentBest, score).toString());
      
      // Trigger page refresh to update header stats
      window.location.reload();
    }
  };

  const renderGame = () => {
    switch (id) {
      case "memory":
        return <MemoryGame onGameComplete={handleGameComplete} />;
      case "math":
        return <MathChallenge onGameComplete={handleGameComplete} />;
      case "logic":
        return <LogicPuzzle onGameComplete={handleGameComplete} />;
      case "words":
        return <WordGame onGameComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  if (isGameActive) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsGameActive(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕ Close
            </Button>
          </div>
          <div className="p-6">
            {renderGame()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`bg-gradient-to-br ${bgColor} ${borderColor} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-2xl`}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">
                {title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                {description}
              </CardDescription>
            </div>
          </div>
          {personalBest > 0 && (
            <Badge variant="secondary" className="text-xs">
              Best: {personalBest}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={handleStartGame}
          className={`w-full bg-gradient-to-r ${color} text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transition-all duration-200`}
        >
          Start Playing
        </Button>
      </CardContent>
    </Card>
  );
}