"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface MathChallengeProps {
  onGameComplete: (score: number) => void;
}

interface MathProblem {
  question: string;
  answer: number;
  difficulty: number;
}

export function MathChallenge({ onGameComplete }: MathChallengeProps) {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute per round
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; type: "correct" | "incorrect" | "" }>({
    message: "", type: ""
  });
  
  const inputRef = useRef<HTMLInputElement>(null);

  const generateProblem = (diff: number): MathProblem => {
    let question: string;
    let answer: number;
    
    switch (diff) {
      case 1: // Easy: Single digit addition/subtraction
        {
          const a = Math.floor(Math.random() * 9) + 1;
          const b = Math.floor(Math.random() * 9) + 1;
          const operation = Math.random() > 0.5 ? "+" : "-";
          if (operation === "+") {
            question = `${a} + ${b}`;
            answer = a + b;
          } else {
            question = `${Math.max(a, b)} - ${Math.min(a, b)}`;
            answer = Math.max(a, b) - Math.min(a, b);
          }
        }
        break;
      
      case 2: // Medium: Two digit addition/subtraction, single digit multiplication
        {
          const operations = ["+", "-", "×"];
          const operation = operations[Math.floor(Math.random() * operations.length)];
          if (operation === "×") {
            const a = Math.floor(Math.random() * 9) + 2;
            const b = Math.floor(Math.random() * 9) + 2;
            question = `${a} × ${b}`;
            answer = a * b;
          } else {
            const a = Math.floor(Math.random() * 50) + 10;
            const b = Math.floor(Math.random() * 50) + 10;
            if (operation === "+") {
              question = `${a} + ${b}`;
              answer = a + b;
            } else {
              question = `${Math.max(a, b)} - ${Math.min(a, b)}`;
              answer = Math.max(a, b) - Math.min(a, b);
            }
          }
        }
        break;
      
      case 3: // Hard: Multi-digit operations, division
        {
          const operations = ["+", "-", "×", "÷"];
          const operation = operations[Math.floor(Math.random() * operations.length)];
          if (operation === "÷") {
            const b = Math.floor(Math.random() * 9) + 2;
            const answer_temp = Math.floor(Math.random() * 20) + 1;
            const a = b * answer_temp;
            question = `${a} ÷ ${b}`;
            answer = answer_temp;
          } else if (operation === "×") {
            const a = Math.floor(Math.random() * 20) + 5;
            const b = Math.floor(Math.random() * 20) + 5;
            question = `${a} × ${b}`;
            answer = a * b;
          } else {
            const a = Math.floor(Math.random() * 200) + 50;
            const b = Math.floor(Math.random() * 200) + 50;
            if (operation === "+") {
              question = `${a} + ${b}`;
              answer = a + b;
            } else {
              question = `${Math.max(a, b)} - ${Math.min(a, b)}`;
              answer = Math.max(a, b) - Math.min(a, b);
            }
          }
        }
        break;
      
      default:
        question = "1 + 1";
        answer = 2;
    }

    return { question, answer, difficulty: diff };
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setTimeLeft(60);
    setDifficulty(1);
    setStreak(0);
    setFeedback({ message: "", type: "" });
    generateNewProblem(1);
  };

  const generateNewProblem = (diff: number) => {
    const problem = generateProblem(diff);
    setCurrentProblem(problem);
    setUserAnswer("");
    setFeedback({ message: "", type: "" });
    // Focus input for better UX
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSubmit = () => {
    if (!currentProblem || userAnswer.trim() === "") return;
    
    const userNum = parseInt(userAnswer);
    const isCorrect = userNum === currentProblem.answer;
    
    setTotalQuestions(totalQuestions + 1);
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setStreak(streak + 1);
      
      // Calculate score based on difficulty and streak
      const baseScore = difficulty * 10;
      const streakBonus = Math.floor(streak / 3) * 5;
      const timeBonus = timeLeft > 45 ? 5 : timeLeft > 30 ? 3 : 1;
      const pointsEarned = baseScore + streakBonus + timeBonus;
      
      setScore(score + pointsEarned);
      setFeedback({ 
        message: `Correct! +${pointsEarned} points ${streak >= 3 ? "🔥" : ""}`, 
        type: "correct" 
      });
      
      // Increase difficulty every 5 correct answers
      if ((correctAnswers + 1) % 5 === 0 && difficulty < 3) {
        setDifficulty(difficulty + 1);
      }
      
      setTimeout(() => {
        generateNewProblem(difficulty);
      }, 1000);
    } else {
      setStreak(0);
      setFeedback({ 
        message: `Incorrect. The answer was ${currentProblem.answer}`, 
        type: "incorrect" 
      });
      
      setTimeout(() => {
        generateNewProblem(difficulty);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Timer effect
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  // Game completion effect
  useEffect(() => {
    if (timeLeft <= 0 && gameStarted) {
      setTimeout(() => {
        onGameComplete(score);
      }, 1000);
    }
  }, [timeLeft, gameStarted, score, onGameComplete]);

  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const timeProgress = (timeLeft / 60) * 100;

  if (!gameStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔢</div>
          <h3 className="text-2xl font-bold text-gray-800">Math Challenge</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Solve as many math problems as you can in 60 seconds! 
            The difficulty increases as you progress.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">How to Play:</h4>
            <ul className="text-sm text-gray-600 space-y-1 text-left max-w-sm mx-auto">
              <li>• Solve math problems as quickly as possible</li>
              <li>• Build streaks for bonus points</li>
              <li>• Difficulty increases every 5 correct answers</li>
              <li>• Speed and accuracy both matter</li>
            </ul>
          </div>
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-purple-500 to-teal-500 text-white font-semibold px-8 py-2"
          >
            Start Challenge
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3 bg-purple-50 border-purple-200">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-700">{score}</div>
            <div className="text-xs text-purple-600">Score</div>
          </div>
        </Card>
        <Card className="p-3 bg-teal-50 border-teal-200">
          <div className="text-center">
            <div className="text-lg font-bold text-teal-700">{correctAnswers}</div>
            <div className="text-xs text-teal-600">Correct</div>
          </div>
        </Card>
        <Card className="p-3 bg-pink-50 border-pink-200">
          <div className="text-center">
            <div className="text-lg font-bold text-pink-700">{Math.round(accuracy)}%</div>
            <div className="text-xs text-pink-600">Accuracy</div>
          </div>
        </Card>
        <Card className="p-3 bg-indigo-50 border-indigo-200">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-700">{streak}</div>
            <div className="text-xs text-indigo-600">Streak</div>
          </div>
        </Card>
        <Card className="p-3 bg-orange-50 border-orange-200">
          <div className="text-center">
            <div className="text-lg font-bold text-orange-700">{timeLeft}s</div>
            <div className="text-xs text-orange-600">Time Left</div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-orange-700">Time Remaining</span>
          <span className="text-orange-600">{Math.round(timeProgress)}%</span>
        </div>
        <Progress value={timeProgress} className="h-3" />
      </div>

      {/* Difficulty Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-white/70 px-4 py-2 rounded-full border">
          <span className="text-sm text-gray-600">Difficulty:</span>
          <div className="flex space-x-1">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-full ${
                  level <= difficulty 
                    ? "bg-gradient-to-r from-purple-400 to-teal-400" 
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {difficulty === 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard"}
          </span>
        </div>
      </div>

      {/* Math Problem */}
      {currentProblem && (
        <div className="text-center space-y-6">
          <div className="bg-white/70 p-8 rounded-xl border border-gray-200 max-w-md mx-auto">
            <div className="text-4xl font-bold text-gray-800 mb-6">
              {currentProblem.question} = ?
            </div>
            
            <div className="space-y-4">
              <Input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Your answer..."
                className="text-center text-2xl font-semibold h-14"
                disabled={timeLeft <= 0}
              />
              
              <Button
                onClick={handleSubmit}
                disabled={userAnswer.trim() === "" || timeLeft <= 0}
                className="w-full bg-gradient-to-r from-purple-500 to-teal-500 text-white font-semibold py-3"
              >
                Submit Answer
              </Button>
            </div>
          </div>

          {/* Feedback */}
          {feedback.message && (
            <div className={`p-4 rounded-lg border ${
              feedback.type === "correct"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800"
                : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200 text-red-800"
            }`}>
              <div className="font-semibold">{feedback.message}</div>
            </div>
          )}
        </div>
      )}

      {/* Game Over */}
      {timeLeft <= 0 && (
        <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="text-4xl">⏱️</div>
          <div className="text-2xl font-bold text-blue-800">Time's Up!</div>
          <div className="space-y-2 text-blue-700">
            <div>Final Score: <span className="font-bold">{score}</span></div>
            <div>Correct Answers: <span className="font-bold">{correctAnswers}</span> / {totalQuestions}</div>
            <div>Accuracy: <span className="font-bold">{Math.round(accuracy)}%</span></div>
            <div>Best Streak: <span className="font-bold">{streak}</span></div>
          </div>
        </div>
      )}

      {/* New Game Button */}
      <div className="text-center">
        <Button 
          onClick={startGame}
          variant="outline"
          className="text-gray-600 hover:text-gray-800"
        >
          🔄 New Challenge
        </Button>
      </div>
    </div>
  );
}