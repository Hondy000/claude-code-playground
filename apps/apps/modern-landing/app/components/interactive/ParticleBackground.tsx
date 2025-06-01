"use client";

// ============================================================
// パーティクル背景コンポーネント
// ============================================================
// Canvas APIを使用したインタラクティブなパーティクル背景。
// マウスの動きに反応してパーティクルが逃げる効果や、
// パーティクル間の接続線を描画して動的な背景を演出します。
// ============================================================

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// パーティクルの型定義
interface Particle {
  x: number; // X座標
  y: number; // Y座標
  vx: number; // X方向の速度
  vy: number; // Y方向の速度
  radius: number; // 半径
  color: string; // 色
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // キャンバスのサイズをウィンドウサイズに合わせる
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // パーティクルを生成（画面サイズに応じて数を調整）
    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, // ランダムな速度
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1, // 1〜3のランダムな半径
          color: `hsla(${Math.random() * 60 + 200}, 70%, 50%, 0.3)` // 青系の色
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // アニメーションループ
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        // パーティクルの位置を更新
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 境界での反射
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // マウスからの反発効果
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx -= (dx / distance) * force * 0.5;
          particle.vy -= (dy / distance) * force * 0.5;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // 近くのパーティクル間に線を描画
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // 距離が150px以内の場合に線を描画
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            // 距離に応じて透明度を変化
            ctx.strokeStyle = `hsla(220, 70%, 50%, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

     resizeCanvas();
     createParticles();
     animate();

    window.addEventListener("resize", handleResize);
     canvas.addEventListener("mousemove", handleMouseMove);

     return () => {
      window.removeEventListener("resize", handleResize);
       canvas.removeEventListener("mousemove", handleMouseMove);
       if (animationRef.current) {
         cancelAnimationFrame(animationRef.current);
       }
     };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ 
        background: "transparent",
        mixBlendMode: "screen"
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
}