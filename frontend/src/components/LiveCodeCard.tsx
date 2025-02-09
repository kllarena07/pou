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
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Badge variant="outline" className="mr-2">
            {filename}
          </Badge>
          {message}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md overflow-hidden">
          <SyntaxHighlighter
            language={language}
            style={vs2015}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
            }}
          >
            {currentCode}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  )
}

