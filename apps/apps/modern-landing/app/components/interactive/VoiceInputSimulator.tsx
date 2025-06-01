"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";

export default function VoiceInputSimulator() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [soundWaves, setSoundWaves] = useState<number[]>([0.3, 0.5, 0.2, 0.7, 0.4, 0.6, 0.3]);

  const sampleCommands = [
    {
      voice: "ダークモードトグルボタンを作って",
      code: `const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};`
    },
    {
      voice: "モダンなカードコンポーネントを生成",
      code: `const ModernCard = ({ title, description, image }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl 
                    bg-white shadow-xl hover:shadow-2xl
                    transition-all duration-300">
      <img src={image} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t 
                      from-black/50 to-transparent opacity-0 
                      group-hover:opacity-100 transition-opacity" />
    </div>
  );
};`
    },
    {
      voice: "アニメーション付きのローディングスピナー",
      code: `const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 
                      border-4 border-gray-300 
                      border-t-blue-600" />
    </div>
  );
};`
    }
  ];

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setSoundWaves(prev => 
          prev.map(() => Math.random() * 0.8 + 0.2)
        );
      }, 100);

      const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
      
      const voiceTimeout = setTimeout(() => {
        setTranscript(randomCommand.voice);
      }, 1500);

      const codeTimeout = setTimeout(() => {
        setGeneratedCode(randomCommand.code);
        setIsListening(false);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(voiceTimeout);
        clearTimeout(codeTimeout);
      };
    } else {
      setSoundWaves([0.3, 0.5, 0.2, 0.7, 0.4, 0.6, 0.3]);
    }
  }, [isListening]);

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript("");
    setGeneratedCode("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">音声入力を体験</h3>
          <p className="text-muted-foreground mb-6">
            マイクボタンをクリックして、音声でコードを生成してみましょう
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button
            onClick={handleStartListening}
            disabled={isListening}
            className={`relative p-8 rounded-full transition-all ${
              isListening 
                ? "bg-red-500/20 cursor-not-allowed" 
                : "bg-primary/10 hover:bg-primary/20 cursor-pointer"
            }`}
            whileHover={!isListening ? { scale: 1.05 } : {}}
            whileTap={!isListening ? { scale: 0.95 } : {}}
          >
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div
                  key="listening"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="relative"
                >
                  <MicOff className="w-12 h-12 text-red-500" />
                  <div className="absolute -inset-4">
                    <div className="flex gap-1 h-full items-center justify-center">
                      {soundWaves.map((height, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-red-500 rounded-full"
                          animate={{ height: `${height * 40}px` }}
                          transition={{ duration: 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Mic className="w-12 h-12 text-primary" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-background/50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">音声認識結果:</span>
              </div>
              <p className="text-lg">{transcript}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {generatedCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-background/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">生成されたコード:</span>
                <motion.button
                  className="text-xs px-2 py-1 bg-primary/10 hover:bg-primary/20 rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigator.clipboard.writeText(generatedCode)}
                >
                  コピー
                </motion.button>
              </div>
              <pre className="text-sm overflow-x-auto">
                <code>{generatedCode}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}