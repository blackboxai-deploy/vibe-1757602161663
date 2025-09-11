"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MemoryGameProps {
  onGameComplete: (score: number) => void;
}

interface CardItem {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const cardSymbols = ["🌸", "🦄", "🌺", "🎀", "💎", "🌈", "⭐", "🔮", "🎪", "🌟", "💫", "🎭"];

export function MemoryGame({ onGameComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const initializeGame = () => {
    const gameSymbols = cardSymbols.slice(0, 6); // Use 6 different symbols
    const gameCards = [...gameSymbols, ...gameSymbols] // Create pairs
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5); // Shuffle cards

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeLeft(120);
    setScore(0);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted || flippedCards.length >= 2) return;
    
    const card = cards[cardId];
    if (card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setMatchedPairs(matchedPairs + 1);
          setFlippedCards([]);
          
          // Add bonus points for quick matches
          const timeBonus = Math.max(0, timeLeft - 60) * 2;
          const moveBonus = Math.max(0, 50 - moves * 5);
          setScore(prev => prev + 100 + timeBonus + moveBonus);
          
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0 || matchedPairs === 6) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, matchedPairs]);

  // Game completion effect
  useEffect(() => {
    if (matchedPairs === 6) {
      // Game won!
      const finalScore = score + (timeLeft * 5); // Time bonus
      setTimeout(() => {
        onGameComplete(finalScore);
      }, 1500);
    } else if (timeLeft <= 0) {
      // Time's up
      setTimeout(() => {
        onGameComplete(score);
      }, 1000);
    }
  }, [matchedPairs, timeLeft, score, onGameComplete]);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  const progress = (matchedPairs / 6) * 100;
  const timeProgress = (timeLeft / 120) * 100;

  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <div className="text-center space-y-4">
          <div className="text-6xl">🧩</div>
          <h3 className="text-2xl font-bold text-gray-800">Memory Card Game</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Match all the pairs of cards as quickly as possible! 
            You have 2 minutes to find all 6 pairs.
          </p>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">How to Play:</h4>
            <ul className="text-sm text-gray-600 space-y-1 text-left max-w-sm mx-auto">
              <li>• Click cards to flip them over</li>
              <li>• Match two cards with the same symbol</li>
              <li>• Complete faster for bonus points</li>
              <li>• Use fewer moves for higher scores</li>
            </ul>
          </div>
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-8 py-2"
          >
            Start Game
          </Button>
        </div>
      ) : (
        <>
          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-3 bg-pink-50 border-pink-200">
              <div className="text-center">
                <div className="text-lg font-bold text-pink-700">{score}</div>
                <div className="text-xs text-pink-600">Score</div>
              </div>
            </Card>
            <Card className="p-3 bg-purple-50 border-purple-200">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-700">{moves}</div>
                <div className="text-xs text-purple-600">Moves</div>
              </div>
            </Card>
            <Card className="p-3 bg-teal-50 border-teal-200">
              <div className="text-center">
                <div className="text-lg font-bold text-teal-700">{matchedPairs}/6</div>
                <div className="text-xs text-teal-600">Pairs Found</div>
              </div>
            </Card>
            <Card className="p-3 bg-indigo-50 border-indigo-200">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-700">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                <div className="text-xs text-indigo-600">Time Left</div>
              </div>
            </Card>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-pink-700">Progress</span>
                <span className="text-pink-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-indigo-700">Time Remaining</span>
                <span className="text-indigo-600">{Math.round(timeProgress)}%</span>
              </div>
              <Progress value={timeProgress} className="h-2" />
            </div>
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  aspect-square rounded-lg text-2xl font-bold transition-all duration-300 transform
                  ${card.isMatched 
                    ? "bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 scale-105" 
                    : card.isFlipped 
                      ? "bg-gradient-to-r from-pink-200 to-purple-200 text-gray-800" 
                      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 hover:from-pink-100 hover:to-purple-100"
                  }
                  ${!card.isMatched && !card.isFlipped ? "hover:scale-105 cursor-pointer" : ""}
                  ${flippedCards.length >= 2 && !card.isFlipped && !card.isMatched ? "cursor-not-allowed" : ""}
                `}
                disabled={flippedCards.length >= 2 && !card.isFlipped && !card.isMatched}
              >
                {card.isFlipped || card.isMatched ? card.symbol : "?"}
              </button>
            ))}
          </div>

          {/* Game Over Messages */}
          {matchedPairs === 6 && (
            <div className="text-center space-y-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="text-3xl">🎉</div>
              <div className="text-xl font-bold text-green-800">Congratulations!</div>
              <div className="text-green-700">You found all pairs! Final score: {score + (timeLeft * 5)}</div>
            </div>
          )}

          {timeLeft <= 0 && matchedPairs < 6 && (
            <div className="text-center space-y-2 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="text-3xl">⏰</div>
              <div className="text-xl font-bold text-orange-800">Time's Up!</div>
              <div className="text-orange-700">You found {matchedPairs} pairs. Final score: {score}</div>
            </div>
          )}

          {/* Restart Button */}
          <div className="text-center">
            <Button 
              onClick={initializeGame}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              🔄 New Game
            </Button>
          </div>
        </>
      )}
    </div>
  );
}