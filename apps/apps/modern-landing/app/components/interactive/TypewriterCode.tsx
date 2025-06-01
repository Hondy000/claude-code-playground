"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterCodeProps {
  code: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypewriterCode({ code, speed = 30, onComplete }: TypewriterCodeProps) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, code, speed, onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const highlightSyntax = (text: string) => {
    const keywords = /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g;
    const strings = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    const functions = /\b(\w+)(?=\()/g;
    const numbers = /\b(\d+)\b/g;

    let highlighted = text
      .replace(strings, '<span class="text-green-500">$&</span>')
      .replace(comments, '<span class="text-gray-500">$&</span>')
      .replace(keywords, '<span class="text-purple-500 font-semibold">$&</span>')
      .replace(functions, '<span class="text-blue-500">$&</span>')
      .replace(numbers, '<span class="text-orange-500">$&</span>');

    return highlighted;
  };

  return (
    <div className="relative">
      <pre className="text-sm md:text-base overflow-x-auto p-4 bg-gray-900 rounded-lg">
        <code 
          dangerouslySetInnerHTML={{ 
            __html: highlightSyntax(displayedCode) 
          }} 
        />
        <motion.span
          className={`inline-block w-0.5 h-5 bg-primary ml-0.5 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0.1 }}
        />
      </pre>
    </div>
  );
}