"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface WordCardProps {
  id: number
  text: string
  language: "chinese" | "english"
  isSelected: boolean
  isMatched: boolean
  showError: boolean
  onSelect: (id: number) => void
}

export default function WordCard({ id, text, language, isSelected, isMatched, showError, onSelect }: WordCardProps) {
  if (isMatched) {
    return <div className="aspect-square"></div> // Empty space for matched cards
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: isSelected ? 1.05 : 1,
        x: showError ? [0, -10, 10, -10, 10, 0] : 0,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: showError ? 0.5 : 0.2,
        type: showError ? "spring" : "tween",
      }}
      onClick={() => onSelect(id)}
      className={cn(
        "aspect-square flex items-center justify-center p-4 rounded-lg cursor-pointer shadow-sm text-center font-medium transition-colors",
        language === "chinese" ? "bg-blue-50 text-blue-800" : "bg-emerald-50 text-emerald-800",
        isSelected &&
          !showError &&
          (language === "chinese" ? "bg-blue-100 ring-2 ring-blue-500" : "bg-emerald-100 ring-2 ring-emerald-500"),
        showError && "bg-red-100 text-red-800 ring-2 ring-red-500",
      )}
    >
      <span className="text-lg">{text}</span>
    </motion.div>
  )
}
