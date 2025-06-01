"use client";

// ============================================================
// 3Dカードコンポーネント
// ============================================================
// マウスの動きに応じて立体的に回転するカードコンポーネント。
// Framer Motionの3Dトランスフォームを使用して、
// ホバー時のインタラクティブな効果を実現します。
// ============================================================

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// コンポーネントのProps型定義
interface Card3DProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card3D({ children, className = "" }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // マウス位置のトラッキング用のmotion値
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // スプリングアニメーションでスムーズな動きを実現
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // マウス位置に基づいた回転角度の計算
  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-17.5deg", "17.5deg"]
  );

  // グラデーション位置のリアクティブな計算
  const gradientX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const gradientY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  // マウス移動時のハンドラ
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    // カードの位置とサイズを取得
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // マウスの相対位置を計算
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // -0.5から0.5の範囲に正規化
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  // マウスがカードから離れた時のハンドラ
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0); // 回転をリセット
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
      role="presentation"
      aria-hidden="false"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {children}
      </div>
      
      <motion.div
        style={{
          transform: "translateZ(-50px)",
        }}
        animate={{
          opacity: isHovered ? 0.5 : 0,
        }}
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-xl"
      />

      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: useTransform(
            [gradientX, gradientY],
            ([x, y]) => `radial-gradient(600px circle at ${x + 50}% ${y + 50}%, rgba(255,255,255,0.1), transparent 40%)`
          ),
        }}
      />
    </motion.div>
  );
}