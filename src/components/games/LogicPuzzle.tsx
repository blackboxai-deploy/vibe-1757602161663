"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LogicPuzzleProps {
  onGameComplete: (score: number) => void;
}

interface Pattern {
  sequence: string[];
  answer: string;
  options: string[];
  type: "color" | "shape" | "number";
  difficulty: number;
}

const colors = ["🔴", "🟡", "🟢", "🔵", "🟣", "🟠"];
const shapes = ["⭐", "💎", "🔺", "⬜", "🔻", "⬛"];
const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];

export function LogicPuzzle({ onGameComplete }: LogicPuzzleProps) {
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 1.5 minutes per round
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [feedback, setFeedback] = useState<{ message: string; type: "correct" | "incorrect" | "" }>({
    message: "", type: ""
  });

  const generatePattern = (diff: number): Pattern => {
    const types = ["color", "shape", "number"] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    let symbols: string[];

    switch (type) {
      case "color":
        symbols = colors;
        break;
      case "shape":
        symbols = shapes;
        break;
      case "number":
        symbols = numbers;
        break;
    }

    let sequence: string[];
    let answer: string;
    let options: string[];

    switch (diff) {
      case 1: // Easy: Simple alternating or repeating patterns
        {
          if (Math.random() > 0.5) {
            // Alternating pattern: A, B, A, B, ?
            const a = symbols[Math.floor(Math.random() * symbols.length)];
            let b = symbols[Math.floor(Math.random() * symbols.length)];
            while (b === a) b = symbols[Math.floor(Math.random() * symbols.length)];
            
            sequence = [a, b, a, b];
            answer = a;
          } else {
            // Repeating pattern: A, A, B, B, ?
            const a = symbols[Math.floor(Math.random() * symbols.length)];
            let b = symbols[Math.floor(Math.random() * symbols.length)];
            while (b === a) b = symbols[Math.floor(Math.random() * symbols.length)];
            
            sequence = [a, a, b, b];
            answer = a;
          }
        }
        break;

      case 2: // Medium: Three-element patterns
        {
          if (Math.random() > 0.5) {
            // ABC pattern: A, B, C, A, B, ?
            const indices = [0, 1, 2].sort(() => Math.random() - 0.5);
            const a = symbols[indices[0]];
            const b = symbols[indices[1]];
            const c = symbols[indices[2]];
            
            sequence = [a, b, c, a, b];
            answer = c;
          } else {
            // Progressive pattern: A, A, B, B, B, ?
            const a = symbols[Math.floor(Math.random() * symbols.length)];
            let b = symbols[Math.floor(Math.random() * symbols.length)];
            while (b === a) b = symbols[Math.floor(Math.random() * symbols.length)];
            
            sequence = [a, a, b, b, b];
            answer = b;
          }
        }
        break;

      case 3: // Hard: Complex patterns
        {
          if (Math.random() > 0.5) {
            // Fibonacci-like: A, B, AB, BAB, ?
            const a = symbols[Math.floor(Math.random() * symbols.length)];
            let b = symbols[Math.floor(Math.random() * symbols.length)];
            while (b === a) b = symbols[Math.floor(Math.random() * symbols.length)];
            
            sequence = [a, b, `${a}${b}`, `${b}${a}${b}`];
            answer = `${a}${b}${b}${a}${b}`;
            // Simplify for display
            sequence = [a, b, a, b];
            answer = a;
          } else {
            // Reverse pattern: A, B, C, C, B, ?
            const indices = [0, 1, 2].sort(() => Math.random() - 0.5);
            const a = symbols[indices[0]];
            const b = symbols[indices[1]];
            const c = symbols[indices[2]];
            
            sequence = [a, b, c, c, b];
            answer = a;
          }
        }
        break;

      default:
        sequence = [symbols[0], symbols[1]];
        answer = symbols[0];
    }

    // Generate options including the correct answer
    const wrongOptions = symbols.filter(s => s !== answer).sort(() => Math.random() - 0.5).slice(0, 3);
    options = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);

    return { sequence, answer, options, type, difficulty: diff };
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setTimeLeft(90);
    setDifficulty(1);
    setFeedback({ message: "", type: "" });
    generateNewPattern(1);
  };

  const generateNewPattern = (diff: number) => {
    const pattern = generatePattern(diff);
    setCurrentPattern(pattern);
    setSelectedAnswer("");
    setFeedback({ message: "", type: "" });
  };

  const handleSubmit = () => {
    if (!currentPattern || selectedAnswer === "") return;
    
    const isCorrect = selectedAnswer === currentPattern.answer;
    setTotalQuestions(totalQuestions + 1);
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      
      // Calculate score based on difficulty and time
      const baseScore = difficulty * 15;
      const timeBonus = timeLeft > 60 ? 10 : timeLeft > 30 ? 5 : 2;
      const pointsEarned = baseScore + timeBonus;
      
      setScore(score + pointsEarned);
      setFeedback({ 
        message: `Excellent! +${pointsEarned} points`, 
        type: "correct" 
      });
      
      // Increase difficulty every 3 correct answers
      if ((correctAnswers + 1) % 3 === 0 && difficulty < 3) {
        setDifficulty(difficulty + 1);
      }
      
      setTimeout(() => {
        generateNewPattern(difficulty);
      }, 1500);
    } else {
      setFeedback({ 
        message: `Not quite! The correct answer was ${currentPattern.answer}`, 
        type: "incorrect" 
      });
      
      setTimeout(() => {
        generateNewPattern(difficulty);
      }, 2000);
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
  const timeProgress = (timeLeft / 90) * 100;

  if (!gameStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎯</div>
          <h3 className="text-2xl font-bold text-gray-800">Logic Puzzle Challenge</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Identify patterns and complete sequences using logical thinking. 
            Patterns get more complex as you progress!
          </p>
          <div className="bg-gradient-to-r from-teal-50 to-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">How to Play:</h4>
            <ul className="text-sm text-gray-600 space-y-1 text-left max-w-sm mx-auto">
              <li>• Study the pattern in the sequence</li>
              <li>• Choose what comes next logically</li>
              <li>• Patterns include colors, shapes, and numbers</li>
              <li>• Think carefully - logic is key!</li>
            </ul>
          </div>
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold px-8 py-2"
          >
            Start Puzzle
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3 bg-teal-50 border-teal-200">
          <div className="text-center">
            <div className="text-lg font-bold text-teal-700">{score}</div>
            <div className="text-xs text-teal-600">Score</div>
          </div>
        </Card>
        <Card className="p-3 bg-indigo-50 border-indigo-200">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-700">{correctAnswers}</div>
            <div className="text-xs text-indigo-600">Correct</div>
          </div>
        </Card>
        <Card className="p-3 bg-purple-50 border-purple-200">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-700">{Math.round(accuracy)}%</div>
            <div className="text-xs text-purple-600">Accuracy</div>
          </div>
        </Card>
        <Card className="p-3 bg-orange-50 border-orange-200">
          <div className="text-center">
            <div className="text-lg font-bold text-orange-700">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
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
          <span className="text-sm text-gray-600">Pattern Complexity:</span>
          <div className="flex space-x-1">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-full ${
                  level <= difficulty 
                    ? "bg-gradient-to-r from-teal-400 to-indigo-400" 
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {difficulty === 1 ? "Simple" : difficulty === 2 ? "Medium" : "Complex"}
          </span>
        </div>
      </div>

      {/* Pattern Display */}
      {currentPattern && (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Complete the pattern:
            </h4>
            
            <div className="bg-white/70 p-6 rounded-xl border border-gray-200 max-w-2xl mx-auto">
              {/* Pattern Sequence */}
              <div className="flex items-center justify-center space-x-4 mb-6 text-4xl">
                {currentPattern.sequence.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span>{item}</span>
                    {index < currentPattern.sequence.length - 1 && (
                      <span className="text-gray-400 mx-2">→</span>
                    )}
                  </div>
                ))}
                <span className="text-gray-400 mx-2">→</span>
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-2xl text-gray-400">
                  ?
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentPattern.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(option)}
                    className={`p-4 text-3xl border-2 rounded-lg transition-all duration-200 ${
                      selectedAnswer === option
                        ? "border-teal-500 bg-teal-50 scale-105"
                        : "border-gray-200 hover:border-teal-300 hover:bg-teal-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === "" || timeLeft <= 0}
              className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold px-8 py-3"
            >
              Submit Answer
            </Button>
          </div>

          {/* Feedback */}
          {feedback.message && (
            <div className={`p-4 rounded-lg border text-center ${
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
          <div className="text-4xl">🧩</div>
          <div className="text-2xl font-bold text-blue-800">Puzzle Complete!</div>
          <div className="space-y-2 text-blue-700">
            <div>Final Score: <span className="font-bold">{score}</span></div>
            <div>Patterns Solved: <span className="font-bold">{correctAnswers}</span> / {totalQuestions}</div>
            <div>Logic Accuracy: <span className="font-bold">{Math.round(accuracy)}%</span></div>
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
          🔄 New Puzzle
        </Button>
      </div>
    </div>
  );
}