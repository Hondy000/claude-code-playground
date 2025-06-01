"use client";

// ============================================================
// インタラクティブコードエディターコンポーネント
// ============================================================
// AIによるコード生成を視覚的に体験できるデモコンポーネント。
// サイドバーからコード例を選択し、タイプライター効果で
// コードが生成される様子をアニメーションで表現します。
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Code2 } from "lucide-react";
import TypewriterCode from "./TypewriterCode";

// コード例の型定義
interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
  output: string;
}

// 生成可能なコードのサンプルデータ
const codeExamples: CodeExample[] = [
  {
    id: "1",
    title: "アニメーションボタン",
    description: "ホバー時に波紋エフェクトが広がるボタン",
    code: `const RippleButton = () => {
  const [ripples, setRipples] = useState([]);
  
  const addRipple = (e) => {
    const rippleContainer = e.currentTarget.getBoundingClientRect();
    const size = rippleContainer.width > rippleContainer.height 
      ? rippleContainer.width 
      : rippleContainer.height;
    const x = e.clientX - rippleContainer.left - size / 2;
    const y = e.clientY - rippleContainer.top - size / 2;
    const newRipple = { x, y, size, id: Date.now() };
    
    setRipples([...ripples, newRipple]);
  };
  
  return (
    <button 
      className="relative overflow-hidden px-6 py-3 
                 bg-blue-500 text-white rounded-lg"
      onClick={addRipple}
    >
      <span className="relative z-10">Click me!</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full 
                     animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </button>
  );
};`,
    output: "✨ インタラクティブなボタンが生成されました！"
  },
  {
    id: "2",
    title: "プログレスバー",
    description: "スムーズなアニメーション付きプログレスバー",
    code: `const AnimatedProgress = ({ value = 75 }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setIsAnimating(true);
  }, []);
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm text-gray-500">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 
                     h-2.5 rounded-full transition-all duration-1000 
                     ease-out"
          style={{
            width: isAnimating ? \`\${value}%\` : '0%',
          }}
        />
      </div>
    </div>
  );
};`,
    output: "📊 プログレスバーが生成されました！"
  },
  {
    id: "3",
    title: "通知トースト",
    description: "スライドインアニメーション付き通知",
    code: `const Toast = ({ message, type = 'success' }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className={\`flex items-center gap-3 p-4 rounded-lg 
                      shadow-lg \${colors[type]} text-white\`}
        >
          <span className="text-2xl">{icons[type]}</span>
          <p>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};`,
    output: "🔔 通知コンポーネントが生成されました！"
  }
];

export default function InteractiveCodeEditor() {
  // 選択中のコード例と生成状態を管理
  const [selectedExample, setSelectedExample] = useState<CodeExample>(codeExamples[0]);
  const [isGenerating, setIsGenerating] = useState(false); // コード生成中かどうか
  const [showOutput, setShowOutput] = useState(false); // 生成完了メッセージの表示状態

  // コード生成ボタンのクリックハンドラ
  const handleGenerate = () => {
    setIsGenerating(true);
    setShowOutput(false);
    
    // コードの長さに応じてタイピング時間を計算
    setTimeout(() => {
      setIsGenerating(false);
      setShowOutput(true);
    }, selectedExample.code.length * 30 + 500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xl font-bold mb-4">コード例を選択</h3>
          <p className="text-sm text-muted-foreground/70 italic mb-4">
            ※ 生成されるコードはイメージです
          </p>
          {codeExamples.map((example) => (
            <motion.button
              key={example.id}
              onClick={() => {
                setSelectedExample(example);
                setShowOutput(false);
              }}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedExample.id === example.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`${example.title}を選択`}
              aria-pressed={selectedExample.id === example.id}
            >
              <div className="flex items-start gap-3">
                <Code2 className="w-5 h-5 text-primary mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold">{example.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {example.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">生成されるコード</h3>
            <motion.button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isGenerating ? { scale: 1.05 } : {}}
              whileTap={!isGenerating ? { scale: 0.95 } : {}}
              aria-label={isGenerating ? "コード生成中" : "コードを生成する"}
              aria-busy={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" aria-hidden="true" />
                  生成中...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" aria-hidden="true" />
                  コード生成
                </>
              )}
            </motion.button>
          </div>

          <div className="bg-gray-900 rounded-xl overflow-hidden">
            {isGenerating ? (
              <TypewriterCode
                code={selectedExample.code}
                onComplete={() => setShowOutput(true)}
              />
            ) : (
              <pre className="text-sm md:text-base p-4 text-gray-400">
                <code>// ボタンをクリックしてコードを生成...</code>
              </pre>
            )}
          </div>

          <AnimatePresence>
            {showOutput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-green-500" aria-hidden="true" />
                  <p className="font-medium text-green-500">
                    {selectedExample.output}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}