"use client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface InputSectionProps {
  userInput: string
  setUserInput: (input: string) => void
  onGenerate: () => void
  isLoading: boolean
  gameCompleted: boolean
  onReset: () => void
}

export default function InputSection({
  userInput,
  setUserInput,
  onGenerate,
  isLoading,
  gameCompleted,
  onReset,
}: InputSectionProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">单词匹配游戏</h2>
      <p className="text-gray-600 mb-4">输入任意文本，AI将生成10个中英文单词对。尝试匹配正确的中英文单词对！</p>

      <Textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="请输入任意文本内容..."
        className="flex-grow min-h-[200px] mb-4"
        disabled={isLoading}
      />

      {gameCompleted ? (
        <Button onClick={onReset} className="w-full">
          重新开始
        </Button>
      ) : (
        <Button onClick={onGenerate} disabled={isLoading || !userInput.trim()} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              生成中...
            </>
          ) : (
            "🎮生成游戏"
          )}
        </Button>
      )}
    </div>
  )
}
