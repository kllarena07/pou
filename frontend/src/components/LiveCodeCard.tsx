"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SyntaxHighlighter from "react-syntax-highlighter"
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs"

interface LiveCodeCardProps {
  filename: string
  language: string
  finalCode: string
  typingSpeed?: number
  message: string
}

export default function LiveCodeCard({ filename, language, finalCode, typingSpeed = 50, message }: LiveCodeCardProps) {
  const [currentCode, setCurrentCode] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const previousCodeRef = useRef(finalCode)

  useEffect(() => {
    if (finalCode !== previousCodeRef.current) {
      setCurrentCode("")
      setCurrentIndex(0)
      previousCodeRef.current = finalCode
    }

    if (currentIndex < finalCode.length) {
      const timer = setTimeout(() => {
        setCurrentCode((prevCode) => prevCode + finalCode[currentIndex])
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, typingSpeed)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, finalCode, typingSpeed])

  return (
    <Card className="w-full max-w-2xl bg-[rgba(20,20,20,0.05)] backdrop-blur-[30px] rounded-[20px] mb-8 mt-5 border border-gray-700/50 p-0 ">
      <CardHeader className="flex justify-between p-4 border-b border-gray-300/10">
        <CardTitle className="text-sm font-medium text-white mb-3">
          <Badge className="mr-7">
            {filename}
          </Badge>
          {message}
        </CardTitle>
        <div className="w-full h-2 bg-gray-700 rounded mt-2 ">
          <div
            className="h-full bg-blue-500 rounded"
            style={{ width: `${(currentIndex / finalCode.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="rounded-md overflow-hidden">
          <SyntaxHighlighter
            language={language}
            style={vs2015}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            }}
          >
            {currentCode}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  )
}

