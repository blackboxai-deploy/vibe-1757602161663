"use client";

import { useState, useEffect } from "react";
import { GameCard } from "@/components/layout/GameCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const gameCategories = [
  {
    id: "memory",
    title: "Memory Games",
    description: "Boost your memory with card matching and pattern recognition games",
    icon: "🧩",
    color: "from-pink-500 to-rose-500",
    bgColor: "from-pink-50 to-rose-50",
    borderColor: "border-pink-200",
  },
  {
    id: "math",
    title: "Math Challenges",
    description: "Sharpen your arithmetic skills with fun number puzzles",
    icon: "🔢",
    color: "from-purple-500 to-violet-500",
    bgColor: "from-purple-50 to-violet-50",
    borderColor: "border-purple-200",
  },
  {
    id: "logic",
    title: "Logic Puzzles",
    description: "Train your logical thinking with pattern and reasoning games",
    icon: "🎯",
    color: "from-teal-500 to-cyan-500",
    bgColor: "from-teal-50 to-cyan-50",
    borderColor: "border-teal-200",
  },
  {
    id: "words",
    title: "Word Games",
    description: "Expand your vocabulary and improve language skills",
    icon: "📚",
    color: "from-indigo-500 to-blue-500",
    bgColor: "from-indigo-50 to-blue-50",
    borderColor: "border-indigo-200",
  },
];

const achievements = [
  { title: "First Steps", description: "Play your first game", achieved: true },
  { title: "Memory Master", description: "Complete 10 memory games", achieved: false },
  { title: "Math Whiz", description: "Solve 50 math problems", achieved: false },
  { title: "Logic Champion", description: "Perfect score on logic puzzles", achieved: false },
  { title: "Word Wizard", description: "Complete all word challenges", achieved: false },
];

export default function HomePage() {
  const [userStats, setUserStats] = useState({
    totalScore: 0,
    gamesPlayed: 0,
    currentStreak: 0,
    bestScore: 0,
  });

  useEffect(() => {
    // Load user stats from localStorage
    if (typeof window !== "undefined") {
      const stats = {
        totalScore: parseInt(localStorage.getItem("brainSharpTotalScore") || "0"),
        gamesPlayed: parseInt(localStorage.getItem("brainSharpGamesPlayed") || "0"),
        currentStreak: parseInt(localStorage.getItem("brainSharpStreak") || "0"),
        bestScore: parseInt(localStorage.getItem("brainSharpBestScore") || "0"),
      };
      setUserStats(stats);
    }
  }, []);

  const skillProgress = {
    memory: Math.min((userStats.totalScore / 1000) * 100, 100),
    math: Math.min((userStats.totalScore / 800) * 100, 100),
    logic: Math.min((userStats.totalScore / 1200) * 100, 100),
    words: Math.min((userStats.totalScore / 900) * 100, 100),
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
          Welcome to Brain Sharp Girls! 🌟
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Challenge yourself with fun cognitive exercises designed to boost your memory, 
          math skills, logical thinking, and vocabulary. Let's make your brain stronger every day!
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-700">{userStats.totalScore}</div>
            <div className="text-sm text-pink-600">Total Score</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">{userStats.gamesPlayed}</div>
            <div className="text-sm text-purple-600">Games Played</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-teal-700">{userStats.currentStreak}</div>
            <div className="text-sm text-teal-600">Day Streak</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-700">{userStats.bestScore}</div>
            <div className="text-sm text-indigo-600">Best Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Choose Your Challenge</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gameCategories.map((category) => (
            <GameCard key={category.id} {...category} />
          ))}
        </div>
      </div>

      {/* Skills Progress */}
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <span>📈</span>
            <span>Your Skill Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-pink-700">Memory Skills</span>
                <span className="text-pink-600">{Math.round(skillProgress.memory)}%</span>
              </div>
              <Progress value={skillProgress.memory} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Math Skills</span>
                <span className="text-purple-600">{Math.round(skillProgress.math)}%</span>
              </div>
              <Progress value={skillProgress.math} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-teal-700">Logic Skills</span>
                <span className="text-teal-600">{Math.round(skillProgress.logic)}%</span>
              </div>
              <Progress value={skillProgress.logic} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-700">Word Skills</span>
                <span className="text-indigo-600">{Math.round(skillProgress.words)}%</span>
              </div>
              <Progress value={skillProgress.words} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <span>🏆</span>
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  achievement.achieved
                    ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-semibold text-sm ${
                      achievement.achieved ? "text-yellow-800" : "text-gray-600"
                    }`}>
                      {achievement.title}
                    </div>
                    <div className={`text-xs ${
                      achievement.achieved ? "text-yellow-600" : "text-gray-500"
                    }`}>
                      {achievement.description}
                    </div>
                  </div>
                  <Badge variant={achievement.achieved ? "default" : "secondary"}>
                    {achievement.achieved ? "✓" : "○"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}