'use client';

// ============================================================
// VibeCoding ランディングページ - メインコンポーネント
// ============================================================
// 「雰囲気でコーディング」という新しい開発スタイルを紹介する
// インタラクティブなランディングページです。
// Framer Motionによるアニメーション、音声入力シミュレーター、
// リアルタイムコードエディタなどの機能を提供します。
// ============================================================

import { motion } from 'framer-motion';
import { Mic, Code, Keyboard, Headphones, Sparkles, Music } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import VoiceInputSimulator from './components/interactive/VoiceInputSimulator';
import InteractiveCodeEditor from './components/interactive/InteractiveCodeEditor';
import Card3D from './components/interactive/Card3D';
import ParticleBackground from './components/interactive/ParticleBackground';

export default function Home() {
  // スクロール状態を管理（ナビゲーションバーの背景変更用）
  const [isScrolled, setIsScrolled] = useState(false);

  // スクロールイベントを監視してナビゲーションバーのスタイルを変更
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // VibeCodingの主要な特徴を定義
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: '雰囲気でコーディング',
      description: '「なんとなくこんな感じ」という直感的な指示で、AIがコードを生成する新時代',
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: '音声入力も可能',
      description: '声で話しかけるだけで、自然言語からコードへ。思考の速度で開発を実現',
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: 'クリエイティブなフロー',
      description: 'Rick Rubinの「The Way of Code」のように、創造性と技術が融合する開発体験',
    },
  ];

  // VibeCodingがもたらすメリットを定義
  const benefits = [
    {
      icon: <Keyboard className="w-6 h-6" />,
      title: '手首の疲労ゼロ',
      description: '長時間のタイピングによる疲労から解放',
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'コード品質向上',
      description: 'AIアシスタントが常に最適なコードパターンを提案',
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: 'マルチタスク対応',
      description: '歩きながら、考えながら、自由なスタイルで開発',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      {/* ナビゲーションバー - スクロール時に背景をぼかし効果付きで表示 */}
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : ''
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="text-xl sm:text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="gradient-primary">VibeCode</span>
            </motion.div>
            <div className="flex items-center gap-2 sm:gap-6">
              <a
                href="#features"
                className="hover:text-primary transition-colors text-sm sm:text-base"
              >
                特徴
              </a>
              <a
                href="#benefits"
                className="hover:text-primary transition-colors text-sm sm:text-base hidden sm:inline"
              >
                メリット
              </a>
              <motion.button
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                今すぐ始める
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ヒーローセクション - ファーストビューでユーザーの興味を引くメインビジュアル */}
      <section className="pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              雰囲気で書く、 <span className="gradient-primary">Vibe Coding</span>
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              「なんとなくこんな感じ」から始まる、AIとの対話型開発。 Andrej
              Karpathy提唱の新手法で、コーディングがもっと自由に。
            </motion.p>
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className="w-4 h-4" />
                雰囲気を感じてみる
              </motion.button>
              <motion.button
                className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                使い方を見る
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ヒーローアニメーション - マイクアイコンの拡大縮小アニメーション */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <Mic className="w-24 h-24 text-primary mb-4" />
                </motion.div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-primary">
                  「関数を作成して」と話すだけ
                </div>
              </div>
            </div>
            <motion.div
              className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* 特徴セクション - VibeCodingの3つの主要機能を紹介 */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-secondary/30 overflow-hidden">
        <div className="container mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Vibe Codingの世界へようこそ
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card3D className="h-full">
                  <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-colors h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* メリットセクション - VibeCodingを使うことで得られる利点を説明 */}
      <section id="benefits" className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              なぜVibe Codingが <span className="gradient-primary">最高</span>
              なのか
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              従来の開発スタイルを根本から変える、数々のメリット
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* デモセクション - 実際の操作イメージを視覚的に表現 */}
      <section className="py-20 px-4 sm:px-6 bg-secondary/30">
        <div className="container mx-auto">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">
              実際の操作を <span className="gradient-primary">体験</span>
            </h2>
            <p className="text-sm text-muted-foreground/70 italic mb-6">
              ※ このセクションで表示されるコード例はイメージです
            </p>
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="space-y-6">
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">
                      あなた: 「なんかいい感じのモダンなボタン作って」
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4"
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <Code className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-muted-foreground">
                      AIが雰囲気を読み取ってコード生成...（イメージ）
                    </p>
                    <pre className="bg-background/50 p-2 rounded mt-2 text-sm overflow-x-auto">
                      {`const ModernButton = ({ children, onClick }) => {
  return (
    <button 
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                 text-white rounded-full shadow-lg hover:shadow-xl 
                 transform hover:scale-105 transition-all duration-200"
      onClick={onClick}
    >
      {children}
    </button>
  )
}`}
                    </pre>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* インタラクティブデモセクション - ユーザーが実際に操作できるデモ機能 */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              インタラクティブな <span className="gradient-primary">開発体験</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              実際に音声入力やコード生成を体験してみましょう
            </p>
          </motion.div>

          <div className="space-y-20">
            {/* 音声入力シミュレーター - 音声認識の体験デモ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <VoiceInputSimulator />
            </motion.div>

            {/* インタラクティブコードエディタ - AIによるコード生成のデモ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-center mb-8">
                AIがコードを生成する様子を見てみよう
              </h3>
              <InteractiveCodeEditor />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA（コール・トゥ・アクション）セクション - ユーザーの行動を促す */}
      <section className="py-20 px-4 sm:px-6">
        <motion.div
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">
            今すぐ <span className="gradient-primary">Vibe Coding</span>
            を始めよう
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            キーボードの限界を超えて、新しい開発体験へ。 今なら無料でお試しいただけます。
          </p>
          <motion.button
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-5 h-5" />
            無料で始める
          </motion.button>
        </motion.div>
      </section>

      {/* フッター - ソーシャルリンクとコピーライト表示 */}
      <footer className="border-t py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl sm:text-2xl font-bold">
              <span className="gradient-primary">VibeCode</span>
            </div>
            <div className="flex gap-6">
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin className="w-5 h-5" />
              </motion.a>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 VibeCode. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
