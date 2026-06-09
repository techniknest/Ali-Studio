"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

function GoldParticle({ delay, duration, x, y, size, opacity }: {
  delay: number;
  duration: number;
  x: string;
  y: string;
  size: number;
  opacity: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(201,168,76,${opacity}) 0%, transparent 70%)`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [opacity * 0.5, opacity, opacity * 0.5],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function LightStreak({ angle, delay, top, left }: {
  angle: number;
  delay: number;
  top: string;
  left: string;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top,
        left,
        width: "200px",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)",
        transform: `rotate(${angle}deg)`,
        transformOrigin: "center",
      }}
      animate={{
        opacity: [0, 0.4, 0],
        scaleX: [0.5, 1.5, 0.5],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function HeroBackground() {
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });

  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate particles with fixed positions
  const particles = [
    { x: "10%", y: "15%", size: 4, opacity: 0.3, delay: 0, duration: 5 },
    { x: "25%", y: "45%", size: 3, opacity: 0.2, delay: 1.2, duration: 6 },
    { x: "40%", y: "20%", size: 5, opacity: 0.25, delay: 0.5, duration: 4.5 },
    { x: "55%", y: "70%", size: 3, opacity: 0.15, delay: 2, duration: 7 },
    { x: "70%", y: "30%", size: 4, opacity: 0.2, delay: 0.8, duration: 5.5 },
    { x: "85%", y: "55%", size: 3, opacity: 0.3, delay: 1.5, duration: 6.5 },
    { x: "15%", y: "75%", size: 5, opacity: 0.2, delay: 3, duration: 5 },
    { x: "60%", y: "10%", size: 3, opacity: 0.25, delay: 0.3, duration: 4 },
    { x: "80%", y: "80%", size: 4, opacity: 0.15, delay: 2.5, duration: 6 },
    { x: "35%", y: "60%", size: 3, opacity: 0.2, delay: 1.8, duration: 5.5 },
    { x: "92%", y: "20%", size: 3, opacity: 0.18, delay: 0.7, duration: 5 },
    { x: "5%", y: "50%", size: 4, opacity: 0.22, delay: 1, duration: 6 },
    { x: "48%", y: "85%", size: 3, opacity: 0.15, delay: 2.2, duration: 7 },
    { x: "75%", y: "5%", size: 5, opacity: 0.2, delay: 0.4, duration: 4.5 },
    { x: "20%", y: "90%", size: 3, opacity: 0.18, delay: 3.5, duration: 6 },
  ];

  const streaks = [
    { angle: 25, delay: 0, top: "20%", left: "10%" },
    { angle: -15, delay: 2, top: "40%", left: "70%" },
    { angle: 35, delay: 4, top: "65%", left: "30%" },
    { angle: -25, delay: 1, top: "15%", left: "80%" },
    { angle: 10, delay: 3, top: "80%", left: "50%" },
  ];

  return (
    <motion.div
      className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-0"
      style={{ opacity: bgOpacity }}
    >
      {/* Film Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay z-20 pointer-events-none" />

      {/* Cinematic Vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Floating Gold Particles */}
      {particles.map((p, i) => (
        <GoldParticle key={`particle-${i}`} {...p} />
      ))}

      {/* Subtle Light Streaks */}
      {streaks.map((s, i) => (
        <LightStreak key={`streak-${i}`} {...s} />
      ))}

      {/* Central Lens Flare Glow */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
