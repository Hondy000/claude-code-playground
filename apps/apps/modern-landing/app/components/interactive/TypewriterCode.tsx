'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterCodeProps {
  code: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypewriterCode({ code, speed = 30, onComplete }: TypewriterCodeProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Reset state when code prop changes
  useEffect(() => {
    setDisplayedCode('');
    setCurrentIndex(0);
    setShowCursor(true);
  }, [code]);

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
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const highlightSyntax = (text: string) => {
    // First, escape HTML to prevent XSS
    const escapeHtml = (str: string) => {
      const htmlEscapes: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
      return str.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
    };

    // Escape the input text
    let highlighted = escapeHtml(text);

    // Optimized regex patterns
    const patterns = [
      // Process comments first (highest priority)
      {
        regex: /(&#x2F;&#x2F;.*$|&#x2F;\*[\s\S]*?\*&#x2F;)/gm,
        replacement: '<span class="text-gray-500">$1</span>',
      },
      // Keywords
      {
        regex:
          /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g,
        replacement: '<span class="text-purple-500 font-semibold">$1</span>',
      },
      // Numbers
      {
        regex: /\b(\d+(?:\.\d+)?)\b/g,
        replacement: '<span class="text-orange-500">$1</span>',
      },
      // Functions (must come before strings to avoid conflicts)
      {
        regex: /\b(\w+)(?=\()/g,
        replacement: '<span class="text-blue-500">$1</span>',
      },
      // Strings (process last to avoid incorrect overlaps)
      {
        regex: /(&quot;|&#x27;|`)(?:(?=(\\?))\2.)*?\1/g,
        replacement: '<span class="text-green-500">$&</span>',
      },
    ];

    // Apply patterns in order
    patterns.forEach(({ regex, replacement }) => {
      highlighted = highlighted.replace(regex, replacement);
    });

    return highlighted;
  };

  return (
    <div
      className="relative"
      role="region"
      aria-live="polite"
      aria-label="タイプライター効果でコードを表示"
    >
      <pre
        className="text-sm md:text-base overflow-x-auto p-4 bg-gray-900 rounded-lg"
        aria-label="コードスニペット"
      >
        <code
          dangerouslySetInnerHTML={{
            __html: highlightSyntax(displayedCode),
          }}
        />
        <motion.span
          className={`inline-block w-0.5 h-5 bg-primary ml-0.5 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0.1 }}
          aria-hidden="true"
        />
      </pre>
    </div>
  );
}
