"use client"

import { useState, useEffect } from "react"
import type { WordPair } from "@/lib/types"
import WordCard from "@/components/word-card"
import { motion } from "framer-motion"
import { shuffle } from "@/lib/utils"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WordMatchingGameProps {
  wordPairs: WordPair[]
  gameStarted: boolean
  onGameComplete: () => void
  gameCompleted: boolean
}

export default function WordMatchingGame({
  wordPairs,
  gameStarted,
  onGameComplete,
  gameCompleted,
}: WordMatchingGameProps) {
  // State for all cards (shuffled Chinese and English words)
  const [cards, setCards] = useState<
    Array<{
      id: number
      pairId: number
      text: string
      language: "chinese" | "english"
      isMatched: boolean
    }>
  >([])

  // Selected cards
  const [selectedCards, setSelectedCards] = useState<number[]>([])

  // Error state for mismatched pairs
  const [showError, setShowError] = useState(false)

  // Prepare cards when word pairs change
  useEffect(() => {
    if (wordPairs.length > 0) {
      const chineseCards = wordPairs.map((pair) => ({
        id: pair.id,
        pairId: pair.id,
        text: pair.chinese,
        language: "chinese" as const,
        isMatched: false,
      }))

      const englishCards = wordPairs.map((pair) => ({
        id: pair.id + 100, // Offset to ensure unique IDs
        pairId: pair.id,
        text: pair.english,
        language: "english" as const,
        isMatched: false,
      }))

      // Combine and shuffle all cards
      setCards(shuffle([...chineseCards, ...englishCards]))
      setSelectedCards([])
    }
  }, [wordPairs])

  // Check if all cards are matched
  useEffect(() => {
    if (gameStarted && cards.length > 0 && cards.every((card) => card.isMatched)) {
      onGameComplete()
    }
  }, [cards, gameStarted, onGameComplete])

  // Handle card selection
  const handleCardSelect = (cardId: number) => {
    // Ignore if showing error or card is already matched
    if (showError || cards.find((c) => c.id === cardId)?.isMatched) {
      return
    }

    // Can only select two cards at a time
    if (selectedCards.length === 2) {
      return
    }

    // Add card to selected cards
    const newSelectedCards = [...selectedCards, cardId]
    setSelectedCards(newSelectedCards)

    // If two cards are selected, check for a match
    if (newSelectedCards.length === 2) {
      const firstCard = cards.find((c) => c.id === newSelectedCards[0])
      const secondCard = cards.find((c) => c.id === newSelectedCards[1])

      if (firstCard && secondCard) {
        // Check if languages are different and pair IDs match
        if (firstCard.language !== secondCard.language && firstCard.pairId === secondCard.pairId) {
          // Match found!
          setTimeout(() => {
            setCards(cards.map((card) => (card.pairId === firstCard.pairId ? { ...card, isMatched: true } : card)))
            setSelectedCards([])
          }, 500)
        } else {
          // No match
          setShowError(true)
          setTimeout(() => {
            setShowError(false)
            setSelectedCards([])
          }, 1000)
        }
      }
    }
  }

  if (!gameStarted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-xl">请在左侧输入文本并点击"生成单词"按钮开始游戏</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">匹配中英文单词</h2>

      {gameCompleted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-grow flex items-center justify-center"
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold text-green-600 mb-4">恭喜完成挑战！</h3>
            <p className="text-xl text-gray-600">你已成功匹配所有单词对</p>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">点击选择一个中文单词和一个英文单词进行匹配。正确匹配的单词对将会消失。</p>
          </div>

          {showError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>单词不匹配，请再试一次！</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-grow">
            {cards.map((card) => (
              <WordCard
                key={card.id}
                id={card.id}
                text={card.text}
                language={card.language}
                isSelected={selectedCards.includes(card.id)}
                isMatched={card.isMatched}
                showError={showError && selectedCards.includes(card.id)}
                onSelect={handleCardSelect}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
