"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Header() {
  const [totalScore, setTotalScore] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("brainSharpTotalScore") || "0");
    }
    return 0;
  });

  const [gamesPlayed, setGamesPlayed] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("brainSharpGamesPlayed") || "0");
    }
    return 0;
  });

  return (
    <header className="border-b border-pink-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🧠</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Brain Sharp Girls
              </h1>
              <p className="text-sm text-gray-600">Sharpen Your Mind Every Day</p>
            </div>
          </div>

          {/* Stats Display */}
          <div className="flex items-center space-x-4">
            <Card className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
              <div className="text-center">
                <div className="text-lg font-bold text-pink-700">{totalScore}</div>
                <div className="text-xs text-pink-600">Total Points</div>
              </div>
            </Card>
            <Card className="px-4 py-2 bg-gradient-to-r from-purple-100 to-teal-100 border-purple-200">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-700">{gamesPlayed}</div>
                <div className="text-xs text-purple-600">Games Played</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </header>
  );
}