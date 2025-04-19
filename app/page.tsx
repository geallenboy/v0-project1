"use client"

import { useState } from "react"
import InputSection from "@/components/input-section"
import WordMatchingGame from "@/components/word-matching-game"
import type { WordPair } from "@/lib/types"

export default function Home() {
  const [userInput, setUserInput] = useState("")
  const [wordPairs, setWordPairs] = useState<WordPair[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)

  // Handle generating words from AI API
  const handleGenerateWords = async () => {
    if (!userInput.trim()) return

    setIsLoading(true)

    try {
      // In a real app, this would be an actual API call
      // For demo purposes, we'll simulate an API response
      const response = await simulateAIApiCall(userInput)
      setWordPairs(response)
      setGameStarted(true)
      setGameCompleted(false)
    } catch (error) {
      console.error("Error generating words:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate AI API call (replace with actual API in production)
  const simulateAIApiCall = async (input: string): Promise<WordPair[]> => {
    try {
      const response = await fetch('/api/ai-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error calling AI API:", error);
      
      // 回退到示例数据
      return [
        { id: 1, chinese: "苹果", english: "apple" },
        { id: 2, chinese: "书", english: "book" },
        { id: 3, chinese: "猫", english: "cat" },
        { id: 4, chinese: "狗", english: "dog" },
        { id: 5, chinese: "房子", english: "house" },
        { id: 6, chinese: "水", english: "water" },
        { id: 7, chinese: "食物", english: "food" },
        { id: 8, chinese: "朋友", english: "friend" },
        { id: 9, chinese: "学校", english: "school" },
        { id: 10, chinese: "电脑", english: "computer" },
      ];
    }
  }

  // Handle game completion
  const onGameComplete = () => {
    setGameCompleted(true)
  }

  // Reset the game
  const handleReset = () => {
    setUserInput("")
    setWordPairs([])
    setGameStarted(false)
    setGameCompleted(false)
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full md:w-1/3 p-6 border-r border-gray-200 flex flex-col">
        <InputSection
          userInput={userInput}
          setUserInput={setUserInput}
          onGenerate={handleGenerateWords}
          isLoading={isLoading}
          gameCompleted={gameCompleted}
          onReset={handleReset}
        />
      </div>

      <div className="w-full md:w-2/3 p-6">
        <WordMatchingGame
          wordPairs={wordPairs}
          gameStarted={gameStarted}
          onGameComplete={onGameComplete}
          gameCompleted={gameCompleted}
        />
      </div>
    </main>
  )
}
