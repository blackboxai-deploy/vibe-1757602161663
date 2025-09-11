"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface WordGameProps {
  onGameComplete: (score: number) => void;
}

interface WordChallenge {
  type: "anagram" | "rhyme" | "synonym" | "category";
  question: string;
  answer: string;
  hints: string[];
  difficulty: number;
}

// Word data for different challenge types
const wordData = {
  easy: {
    anagrams: [
      { word: "STAR", scrambled: "ARTS", hint: "Bright object in the sky" },
      { word: "HEART", scrambled: "EARTH", hint: "Organ that pumps blood" },
      { word: "LISTEN", scrambled: "SILENT", hint: "To hear sounds" },
      { word: "SMILE", scrambled: "LIMES", hint: "Happy facial expression" },
      { word: "ANGEL", scrambled: "GLEAN", hint: "Heavenly being" },
    ],
    rhymes: [
      { word: "CAT", answer: "HAT", hint: "Something you wear on your head" },
      { word: "SUN", answer: "FUN", hint: "Enjoyment and laughter" },
      { word: "TREE", answer: "FREE", hint: "Not costing any money" },
      { word: "NIGHT", answer: "LIGHT", hint: "Opposite of darkness" },
      { word: "PLAY", answer: "DAY", hint: "24 hours" },
    ],
    synonyms: [
      { word: "HAPPY", answer: "GLAD", hint: "Another word for joyful" },
      { word: "BIG", answer: "LARGE", hint: "Not small in size" },
      { word: "FAST", answer: "QUICK", hint: "Moving with speed" },
      { word: "SMART", answer: "CLEVER", hint: "Having intelligence" },
      { word: "PRETTY", answer: "BEAUTIFUL", hint: "Attractive to look at" },
    ]
  },
  medium: {
    anagrams: [
      { word: "FRIEND", scrambled: "FINDER", hint: "Someone you care about" },
      { word: "TEACHER", scrambled: "CHEATER", hint: "Person who educates students" },
      { word: "RAINBOW", scrambled: "BORROW", hint: "Colorful arc in the sky" },
      { word: "PRINCESS", scrambled: "INSPIRES", hint: "Royal daughter" },
      { word: "BUTTERFLY", scrambled: "FLUTTER", hint: "Colorful flying insect" },
    ],
    categories: [
      { category: "COLORS", answer: "PURPLE", hint: "Mix of red and blue" },
      { category: "ANIMALS", answer: "ELEPHANT", hint: "Large gray mammal with trunk" },
      { category: "FRUITS", answer: "PINEAPPLE", hint: "Tropical fruit with spiky skin" },
      { category: "FLOWERS", answer: "SUNFLOWER", hint: "Yellow flower that follows the sun" },
      { category: "EMOTIONS", answer: "EXCITEMENT", hint: "Feeling of eager enthusiasm" },
    ]
  }
};

export function WordGame({ onGameComplete }: WordGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per round
  const [gameStarted, setGameStarted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; type: "correct" | "incorrect" | "" }>({
    message: "", type: ""
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const generateChallenge = (): WordChallenge => {
    const difficulty = Math.random() > 0.6 ? "medium" : "easy";
    const challengeTypes = difficulty === "easy" 
      ? ["anagram", "rhyme", "synonym"]
      : ["anagram", "category"];
    
    const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)] as WordChallenge["type"];
    
    let challenge: WordChallenge;
    
    switch (type) {
      case "anagram":
        {
          const anagrams = wordData[difficulty].anagrams;
          const item = anagrams[Math.floor(Math.random() * anagrams.length)];
          challenge = {
            type: "anagram",
            question: `Unscramble: ${item.scrambled}`,
            answer: item.word,
            hints: [item.hint, `${item.word.length} letters`, `Starts with '${item.word[0]}'`],
            difficulty: difficulty === "easy" ? 1 : 2
          };
        }
        break;
      
      case "rhyme":
        {
          const rhymes = wordData.easy.rhymes;
          const item = rhymes[Math.floor(Math.random() * rhymes.length)];
          challenge = {
            type: "rhyme",
            question: `What rhymes with: ${item.word}?`,
            answer: item.answer,
            hints: [item.hint, `${item.answer.length} letters`, `Ends with '${item.answer.slice(-2)}'`],
            difficulty: 1
          };
        }
        break;
      
      case "synonym":
        {
          const synonyms = wordData.easy.synonyms;
          const item = synonyms[Math.floor(Math.random() * synonyms.length)];
          challenge = {
            type: "synonym",
            question: `Synonym for: ${item.word}`,
            answer: item.answer,
            hints: [item.hint, `${item.answer.length} letters`, `Another word meaning the same`],
            difficulty: 1
          };
        }
        break;
      
      case "category":
        {
          const categories = wordData.medium.categories;
          const item = categories[Math.floor(Math.random() * categories.length)];
          challenge = {
            type: "category",
            question: `Name a ${item.category.toLowerCase()}:`,
            answer: item.answer,
            hints: [item.hint, `${item.answer.length} letters`, `Category: ${item.category}`],
            difficulty: 2
          };
        }
        break;
    }
    
    return challenge;
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setTimeLeft(120);
    setHintsUsed(0);
    setFeedback({ message: "", type: "" });
    generateNewChallenge();
  };

  const generateNewChallenge = () => {
    const challenge = generateChallenge();
    setCurrentChallenge(challenge);
    setUserAnswer("");
    setCurrentHintIndex(0);
    setFeedback({ message: "", type: "" });
    // Focus input for better UX
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSubmit = () => {
    if (!currentChallenge || userAnswer.trim() === "") return;
    
    const isCorrect = userAnswer.toUpperCase().trim() === currentChallenge.answer.toUpperCase();
    setTotalQuestions(totalQuestions + 1);
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      
      // Calculate score based on difficulty, time, and hints used
      const baseScore = currentChallenge.difficulty * 20;
      const timeBonus = timeLeft > 90 ? 15 : timeLeft > 60 ? 10 : 5;
      const hintPenalty = currentHintIndex * 5; // Penalty for using hints
      const pointsEarned = Math.max(baseScore + timeBonus - hintPenalty, 5);
      
      setScore(score + pointsEarned);
      setFeedback({ 
        message: `Excellent! +${pointsEarned} points`, 
        type: "correct" 
      });
      
      setTimeout(() => {
        generateNewChallenge();
      }, 1500);
    } else {
      setFeedback({ 
        message: `Not quite! The answer was: ${currentChallenge.answer}`, 
        type: "incorrect" 
      });
      
      setTimeout(() => {
        generateNewChallenge();
      }, 2500);
    }
  };

  const showHint = () => {
    if (!currentChallenge || currentHintIndex >= currentChallenge.hints.length) return;
    setCurrentHintIndex(currentHintIndex + 1);
    setHintsUsed(hintsUsed + 1);
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
  const timeProgress = (timeLeft / 120) * 100;

  if (!gameStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">📚</div>
          <h3 className="text-2xl font-bold text-gray-800">Word Challenge</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Test your vocabulary with anagrams, rhymes, synonyms, and word categories. 
            Build your language skills while having fun!
          </p>
          <div className="bg-gradient-to-r from-indigo-50 to-pink-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Challenge Types:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 max-w-md mx-auto">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">🔤</Badge>
                <span>Anagrams</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">🎵</Badge>
                <span>Rhyming</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">📖</Badge>
                <span>Synonyms</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">📂</Badge>
                <span>Categories</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold px-8 py-2"
          >
            Start Word Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3 bg-indigo-50 border-indigo-200">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-700">{score}</div>
            <div className="text-xs text-indigo-600">Score</div>
          </div>
        </Card>
        <Card className="p-3 bg-pink-50 border-pink-200">
          <div className="text-center">
            <div className="text-lg font-bold text-pink-700">{correctAnswers}</div>
            <div className="text-xs text-pink-600">Correct</div>
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

      {/* Word Challenge */}
      {currentChallenge && (
        <div className="space-y-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 text-sm">
              {currentChallenge.type.toUpperCase()} CHALLENGE
            </Badge>
            
            <div className="bg-white/70 p-6 rounded-xl border border-gray-200 max-w-lg mx-auto">
              <div className="text-2xl font-bold text-gray-800 mb-6">
                {currentChallenge.question}
              </div>
              
              <div className="space-y-4">
                <Input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer..."
                  className="text-center text-xl font-semibold h-12"
                  disabled={timeLeft <= 0}
                />
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={userAnswer.trim() === "" || timeLeft <= 0}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold py-3"
                  >
                    Submit Answer
                  </Button>
                  
                  <Button
                    onClick={showHint}
                    disabled={currentHintIndex >= currentChallenge.hints.length || timeLeft <= 0}
                    variant="outline"
                    className="px-4 py-3"
                  >
                    💡 Hint
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Hints Display */}
          {currentHintIndex > 0 && (
            <div className="max-w-lg mx-auto">
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <div className="text-center">
                  <div className="text-sm font-semibold text-yellow-800 mb-2">
                    💡 Hints Used: {currentHintIndex}
                  </div>
                  <div className="space-y-1">
                    {currentChallenge.hints.slice(0, currentHintIndex).map((hint, index) => (
                      <div key={index} className="text-sm text-yellow-700">
                        {index + 1}. {hint}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Feedback */}
          {feedback.message && (
            <div className={`p-4 rounded-lg border text-center max-w-lg mx-auto ${
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
          <div className="text-4xl">📝</div>
          <div className="text-2xl font-bold text-blue-800">Words Complete!</div>
          <div className="space-y-2 text-blue-700">
            <div>Final Score: <span className="font-bold">{score}</span></div>
            <div>Words Solved: <span className="font-bold">{correctAnswers}</span> / {totalQuestions}</div>
            <div>Accuracy: <span className="font-bold">{Math.round(accuracy)}%</span></div>
            <div>Hints Used: <span className="font-bold">{hintsUsed}</span></div>
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
          🔄 New Word Game
        </Button>
      </div>
    </div>
  );
}