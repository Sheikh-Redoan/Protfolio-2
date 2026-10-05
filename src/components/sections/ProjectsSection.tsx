"use client";

import React, { useEffect, useRef, useState, useLayoutEffect, useMemo } from "react";
import { useLenis } from "lenis/react";
import { supabase } from "@/lib/supabaseClient";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import {
  ChevronDown,
  X,
  MapPin,
  Clock,
  Mountain,
  ArrowRight,
  Star,
  Activity,
  Compass,
  ExternalLink,
  Video,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

// ─── Data ────────────────────────────────────────────────────────────────────

interface ProjectItem {
  src: string;
  alt: string;
  dist: string;
  elev: string;
  time: string;
  desc: string;
  live?: string;
  git?: string;
  video?: string;
}

const IMAGES: ProjectItem[] = [
  {
    src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop",
    alt: "Storybook AI",
    dist: "React",
    elev: "Redux",
    time: "2024",
    desc: "Engineered AI-powered React canvas with drag-and-drop and image generation, slashing artbook creation time. Added Redux state with PDF/JSON export for reliable saving, backup, and publishing.",
  },
  {
    src: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1200&auto=format&fit=crop",
    alt: "Lingual Jams",
    dist: "React",
    elev: "Framer",
    time: "2024",
    desc: "Built a React audio-lyric player with a 3D page-flip UI for immersive learning. Created a Redux-powered quiz with Framer Motion animations and responsive Tailwind.",
  },
  {
    src: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=1200&auto=format&fit=crop",
    alt: "3D AR Gallery",
    dist: "React",
    elev: "Three.js",
    time: "2023",
    desc: "Built a React-based 3D AR gallery featuring custom .glb uploads and dynamic lighting controls, with seamless WebXR integration.",
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    alt: "Warm Welcome",
    dist: "React",
    elev: "Vite",
    time: "2023",
    desc: "Delivered a high-performance frontend architecture using React, Vite, and Tailwind CSS. Powered seamless client-side interactions by optimizing state management and API data fetching.",
  },
  {
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    alt: "Portfolio v2",
    dist: "Next.js",
    elev: "GSAP",
    time: "2024",
    desc: "Designed and built a cinematic personal portfolio with advanced GSAP animations, smooth Lenis scrolling, and a dynamic skills orbit visualisation.",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    alt: "Dev Dashboard",
    dist: "React",
    elev: "Tailwind",
    time: "2023",
    desc: "Built an analytics dashboard with real-time data visualisation, role-based access control, and a fully responsive design using Tailwind CSS.",
  },
  {
    src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop",
    alt: "Mobile App UI",
    dist: "React Native",
    elev: "Expo",
    time: "2023",
    desc: "Crafted pixel-perfect cross-platform mobile UI in React Native, leveraging Reanimated 2 for 60fps gesture-driven animations.",
  },
  {
    src: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop",
    alt: "E-Commerce",
    dist: "Next.js",
    elev: "Stripe",
    time: "2022",
    desc: "End-to-end storefront with Server Components, Stripe Checkout, and a rich product-filtering UX that boosted conversion rate significantly.",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING_CONFIG = { stiffness: 40, damping: 25, mass: 1 };
const PROGRESS_SPRING = { stiffness: 60, damping: 30, restDelta: 0.001 };

// ─── Orbit card geometry ─────────────────────────────────────────────────────

interface CardData {
  item: ProjectItem;
  index: number;
  linearOffset: { x: number; y: number };
  linearRotate: number;
  target: { x: number; y: number; rotate: number; scale: number };
  targetSm: { x: number; y: number; rotate: number; scale: number };
  z: number;
}

const generateOrbitCards = (images: ProjectItem[]): CardData[] => {
  const radiusX = 42;
  const radiusY = 15;
  const radiusXSm = 30;
  const radiusYSm = 35;
  const total = images.length;

  return images.map((item, i) => {
    const angle = (i * (Math.PI * 2)) / total;
    const x = Math.cos(angle - Math.PI / 2) * radiusX;
    const y = Math.sin(angle - Math.PI / 2) * radiusY;
    const xSm = Math.cos(angle - Math.PI / 2) * radiusXSm;
    const ySm = Math.sin(angle - Math.PI / 2) * radiusYSm;

    const depthScale = Math.sin(angle - Math.PI / 2);
    const targetScale = 0.8 + depthScale * 0.25;
    const zIndex = Math.round((depthScale + 1) * 100);
    const rotate = Math.cos(angle - Math.PI / 2) * 15;

    return {
      item,
      index: i,
      linearOffset: { x: (i - total / 2) * 4, y: (i - total / 2) * 3 },
      linearRotate: (i - total / 2) * 3,
      target: { x, y: y + 8, rotate, scale: targetScale },
      targetSm: { x: xSm, y: ySm + 5, rotate: rotate * 0.5, scale: targetScale * 0.85 },
      z: zIndex,
    };
  });
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function usePointerParallax(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled || !active) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active, enabled, rawX, rawY]);

  return { x, y };
}

// ─── OrbitCard ────────────────────────────────────────────────────────────────

interface OrbitCardProps {
  card: CardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  isSpreadActive: boolean;
  isMobile: boolean;
  onClick: (i: number) => void;
}

function OrbitCard({ card, progress, pointer, isSpreadActive, isMobile, onClick }: OrbitCardProps) {
  const { item, linearOffset, linearRotate, z, index } = card;
  const activeTarget = isMobile ? card.targetSm : card.target;
  const depthFactor = 0.2 + z / 200;

  const translate = useTransform(
    [progress, pointer.x, pointer.y] as MotionValue[],
    ([p, px, py]: number[]) => {
      const easeP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const tx = linearOffset.x + (activeTarget.x - linearOffset.x) * easeP;
      const ty = linearOffset.y + (activeTarget.y - linearOffset.y) * easeP;
      const dx = tx - px * 5 * depthFactor * p;
      const dy = ty - py * 5 * depthFactor * p;
      return `calc(-50% + ${dx}vw) calc(-50% + ${dy}vh)`;
    }
  );

  const rotate = useTransform(progress, [0, 1], [linearRotate, activeTarget.rotate]);
  const scale = useTransform(progress, [0, 1], [0.5, activeTarget.scale]);

  return (
    // Outer div handles all orbit-transform MotionValues (translate, rotate, scale)
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform w-[260px] md:w-[300px]"
      style={{ zIndex: z, translate, rotate, scale }}
    >
      {/* Inner div handles hover independently — whileHover can't override a parent MotionValue */}
      <motion.div
        onClick={() => isSpreadActive && onClick(index)}
        className="w-full"
        whileHover={
          isSpreadActive
            ? { scale: 1.06, transition: { type: "spring", stiffness: 300, damping: 20 } }
            : undefined
        }
      >
      <div
        className={`bg-white dark:bg-[#1a1a1a] rounded-[28px] p-[12px] md:p-[14px] shadow-[0_20px_45px_rgba(0,0,0,0.15)] dark:shadow-black/50 w-full transition-shadow transition-colors ${
          isSpreadActive ? "cursor-pointer hover:shadow-2xl" : "cursor-default"
        }`}
      >
        {/* Image area */}
        <div className="relative h-[160px] md:h-[190px] rounded-[20px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute top-3 right-3 flex gap-2 z-30">
            {item.live && (
              <a href={item.live} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer pointer-events-auto">
                <ExternalLink size={14} />
              </a>
            )}
            {item.git && (
              <a href={item.git} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer pointer-events-auto">
                <FaGithub size={14} />
              </a>
            )}
            {item.video && (
              <a href={item.video} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-600 transition-colors cursor-pointer pointer-events-auto">
                <Video size={14} />
              </a>
            )}
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-[60px] bg-gradient-to-t from-black/55 to-transparent flex items-center justify-between px-[14px] z-20 pointer-events-none">
            <div className="text-white">
              <div className="font-bold text-[0.85rem] md:text-[0.9rem] leading-tight">
                {item.alt}
              </div>
              <div className="text-[0.65rem] md:text-[0.7rem] opacity-80">Frontend Dev</div>
            </div>
          </div>
        </div>

        {/* Card meta */}
        <div className="pt-3 md:pt-4 px-1.5 pb-1 md:pb-1.5 text-left pointer-events-none">
          <div className="font-bold text-[#111] dark:text-zinc-100 text-[0.9rem] md:text-[0.95rem]">
            {item.alt}
          </div>
          <div className="text-[#999] dark:text-zinc-400 text-[0.65rem] md:text-[0.72rem] mt-0.5 mb-3 md:mb-4">
            {item.time} &bull; Sheikh Redoan
          </div>

          <div className="flex gap-[16px] md:gap-[22px] items-center">
            <div>
              <div className="font-bold text-[0.75rem] md:text-[0.85rem] text-[#111] dark:text-zinc-100">
                {item.dist}
              </div>
              <span className="block font-normal text-[0.6rem] md:text-[0.65rem] text-[#999] dark:text-zinc-400 mt-[2px]">
                Stack
              </span>
            </div>
            <div>
              <div className="font-bold text-[0.75rem] md:text-[0.85rem] text-[#111] dark:text-zinc-100">
                {item.elev}
              </div>
              <span className="block font-normal text-[0.6rem] md:text-[0.65rem] text-[#999] dark:text-zinc-400 mt-[2px]">
                Tool
              </span>
            </div>
            <div>
              <div className="font-bold text-[0.75rem] md:text-[0.85rem] text-[#111] dark:text-zinc-100">
                {item.time}
              </div>
              <span className="block font-normal text-[0.6rem] md:text-[0.65rem] text-[#999] dark:text-zinc-400 mt-[2px]">
                Year
              </span>
            </div>

            <div className="ml-auto w-[40px] h-[40px] md:w-[52px] md:h-[52px] rounded-[12px] md:rounded-[14px] bg-[#f4f4f4] dark:bg-zinc-800 flex items-center justify-center shrink-0">
              <ArrowRight size={20} className="text-[#111] dark:text-zinc-200" />
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}

// ─── StackedCard ─────────────────────────────────────────────────────────────

interface StackedCardProps {
  item: ProjectItem;
  i: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

function StackedCard({ item, i, total, scrollYProgress }: StackedCardProps) {
  const isEven = i % 2 === 0;

  const buildTransforms = () => {
    const step = 1 / Math.max(total - 1, 1);
    const inputs: number[] = [];
    const yOut: string[] = [];
    const scaleOut: number[] = [];
    const overlayOut: number[] = [];

    if (i > 0) {
      inputs.push((i - 1) * step);
      yOut.push("calc(-50% + 100vh)");
      scaleOut.push(1);
      overlayOut.push(0);
    }

    inputs.push(i * step);
    yOut.push("calc(-50% + 0vh)");
    scaleOut.push(1);
    overlayOut.push(0);

    if (i < total - 1) {
      inputs.push((i + 1) * step);
      yOut.push("calc(-50% - 6vh)");
      scaleOut.push(0.95);
      overlayOut.push(0.6);
    }

    if (i < total - 2) {
      inputs.push(1);
      yOut.push("calc(-50% - 10vh)");
      scaleOut.push(0.9);
      overlayOut.push(0.85);
    }

    if (inputs.length === 1) {
      inputs.push(1);
      yOut.push("calc(-50% + 0vh)");
      scaleOut.push(1);
      overlayOut.push(0);
    }

    return { inputs, yOut, scaleOut, overlayOut };
  };

  const { inputs, yOut, scaleOut, overlayOut } = buildTransforms();

  const y = useTransform(scrollYProgress, inputs, yOut);
  const scale = useTransform(scrollYProgress, inputs, scaleOut);
  const overlayOpacity = useTransform(scrollYProgress, inputs, overlayOut);

  return (
    <motion.div
      className={`absolute top-1/2 left-1/2 w-[98vw] md:w-[98vw] max-w-7xl h-[75vh] md:h-[70vh] bg-[#0a0a0a] rounded-[24px] md:rounded-[32px] border border-[#222] shadow-[0_40px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
      style={{ x: "-50%", y, scale, zIndex: i, transformOrigin: "top center" }}
    >
      {/* Dimming overlay */}
      <motion.div
        className="absolute inset-0 bg-black z-50 pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* Image side */}
      <div
        className={`relative w-full md:w-1/2 h-[45%] md:h-full shrink-0 border-b md:border-b-0 bg-black ${
          isEven ? "md:border-r border-[#222]" : "md:border-l border-[#222]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt}
          className="w-full h-full object-cover opacity-70 mix-blend-lighten"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent`}
        />

        <div
          className={`absolute bottom-6 md:bottom-10 z-10 text-white ${
            isEven ? "left-6 md:left-10" : "right-6 md:right-10 md:text-right"
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">{item.alt}</h2>
        </div>
      </div>

      {/* Details side */}
      <div className="w-full md:w-1/2 h-[55%] md:h-full p-6 md:p-10 lg:p-14 flex flex-col justify-between bg-[#0a0a0a] text-neutral-300 relative overflow-y-auto no-scrollbar">
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a1a1a] text-neutral-200 text-xs font-bold uppercase tracking-widest border border-[#333]">
              <Activity size={14} /> Frontend Dev
            </span>
            <div className="flex gap-1 text-yellow-500">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} size={16} fill={idx < 4 ? "currentColor" : "none"} />
              ))}
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Project Overview</h3>
          <p className="text-base md:text-lg leading-relaxed text-neutral-400">{item.desc}</p>
        </div>

        <div className="mt-8 pt-8 border-t border-[#222] grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white">
              <Compass size={18} />
            </div>
            <div className="font-bold text-white text-lg">{item.dist}</div>
            <div className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-widest">
              Stack
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white">
              <Mountain size={18} />
            </div>
            <div className="font-bold text-white text-lg">{item.elev}</div>
            <div className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-widest">
              Tooling
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white">
              <Clock size={18} />
            </div>
            <div className="font-bold text-white text-lg">{item.time}</div>
            <div className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-widest">
              Year
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col lg:flex-row gap-3 w-full">
          {item.live && (
            <a href={item.live} target="_blank" rel="noreferrer" className="flex-1 py-3 md:py-4 rounded-xl bg-white text-black font-black text-sm md:text-base hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
              <ExternalLink size={18} /> Live Demo
            </a>
          )}
          {item.git && (
            <a href={item.git} target="_blank" rel="noreferrer" className="flex-1 py-3 md:py-4 rounded-xl bg-[#24292e] text-white font-bold text-sm md:text-base hover:bg-[#2f363d] transition-colors flex items-center justify-center gap-2 border border-[#444]">
              <FaGithub size={18} /> Source Code
            </a>
          )}
          {item.video && (
            <a href={item.video} target="_blank" rel="noreferrer" className="flex-1 py-3 md:py-4 rounded-xl bg-red-600 text-white font-bold text-sm md:text-base hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <Video size={18} /> Video Guide
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── ProjectModal ─────────────────────────────────────────────────────────────

interface ProjectModalProps {
  cards: CardData[];
  initialIndex: number;
  onClose: () => void;
}

function ScrollHint({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);
  return (
    <motion.div
      className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-neutral-500 pointer-events-none"
      style={{ opacity }}
    >
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-2 text-neutral-400">
        Scroll stack
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown size={20} className="text-white" />
      </motion.div>
    </motion.div>
  );
}

function ProjectModal({ cards, initialIndex, onClose }: ProjectModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalCards = cards.length;

  const { scrollYProgress } = useScroll({ container: containerRef });

  useLayoutEffect(() => {
    if (containerRef.current) {
      const vh = window.innerHeight;
      containerRef.current.scrollTo({ top: initialIndex * vh, behavior: "instant" });
    }
  }, [initialIndex]);

  const globalLenis = useLenis();

  // Pause the global Lenis and lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    globalLenis?.stop();
    return () => {
      document.body.style.overflow = "";
      globalLenis?.start();
    };
  }, [globalLenis]);

  // Local Lenis instance scoped to the modal — gives smooth scrolling inside the popup
  useEffect(() => {
    const wrapper = containerRef.current;
    if (!wrapper) return;
    const content = wrapper.firstElementChild as HTMLElement | null;
    if (!content) return;

    let rafId: number;
    let localLenis: import("lenis").default | null = null;

    import("lenis").then(({ default: Lenis }) => {
      localLenis = new (Lenis as any)({
        wrapper,
        content,
        lerp: 0.1,
        duration: 1.4,
        smoothWheel: true,
        infinite: false,
      });

      const raf = (time: number) => {
        localLenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      localLenis?.destroy();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#000000] overflow-hidden"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] w-12 h-12 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] rounded-full flex items-center justify-center text-white transition-colors shadow-2xl"
      >
        <X size={24} />
      </button>

      {/* data-lenis-prevent: blocks the global ReactLenis from intercepting wheel events.
           The local Lenis instance above takes over smooth scrolling for this container. */}
      <div
        ref={containerRef}
        data-lenis-prevent
        className="w-full h-full overflow-y-auto no-scrollbar"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {/* Tall inner div — (totalCards) × 100vh */}
        <div style={{ height: `${totalCards * 100}vh` }} className="w-full relative">
          {/* Sticky wrapper */}
          <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
            {cards.map((card, i) => (
              <StackedCard
                key={card.index}
                item={card.item}
                i={i}
                total={totalCards}
                scrollYProgress={scrollYProgress}
              />
            ))}

            <ScrollHint scrollYProgress={scrollYProgress} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CinematicOrbitHero ───────────────────────────────────────────────────────

interface CinematicOrbitHeroProps {
  cards: CardData[];
  onCardClick: (index: number) => void;
  sectionTitle: string;
  sectionSubtitle: string;
}

function CinematicOrbitHero({ cards, onCardClick, sectionTitle, sectionSubtitle }: CinematicOrbitHeroProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, PROGRESS_SPRING);
  const progress = useTransform(smoothProgress, [0.1, 0.9], [0, 1]);

  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, "change", (p) => setSpread(p > 0.95));

  const pointer = usePointerParallax(spread, !reduce);
  const textScale = useTransform(progress, [0, 1], [0.85, 1]);
  const textOpacity = useTransform(progress, [0.2, 0.8], [0, 1]);

  return (
    <section
      ref={wrapRef}
      className="relative w-full h-[350vh] bg-slate-100 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 font-sans"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        {/* Background glow blob */}
        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60 dark:opacity-30 blur-[100px] md:blur-[120px]"
          style={{ scale: textScale }}
        >
          <div className="w-[80vw] md:w-[40vw] h-[80vw] md:h-[40vw] rounded-full bg-blue-300/40 dark:bg-indigo-500/20 mix-blend-multiply dark:mix-blend-screen" />
        </motion.div>

        {/* Hero text */}
        <motion.div
          className="pointer-events-none z-[5] flex flex-col items-center text-center px-6 mt-[-15vh] md:mt-[-10vh]"
          style={{ opacity: textOpacity, scale: textScale }}
        >
          <h2 className="text-4xl md:text-[6vw] font-black tracking-tighter text-slate-800 dark:text-white">
            {sectionTitle}
          </h2>
          <p className="mt-12 max-w-[50ch] text-sm md:text-base font-medium opacity-80 dark:opacity-60 text-slate-600 dark:text-slate-300">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Orbit cards layer */}
        <div className="absolute inset-0 z-10">
          {cards.map((card) => (
            <OrbitCard
              key={card.index}
              card={card}
              progress={progress}
              pointer={pointer}
              isSpreadActive={spread}
              isMobile={isMobile}
              onClick={onCardClick}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neutral-500 flex flex-col items-center gap-2 z-[20] pointer-events-none"
          animate={{ opacity: spread ? 0 : 1, y: spread ? 20 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs uppercase tracking-widest font-semibold">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [projectsData, setProjectsData] = useState<ProjectItem[]>(IMAGES);
  const [sectionTitle, setSectionTitle] = useState("Discover Projects.");
  const [sectionSubtitle, setSectionSubtitle] = useState("Explore curated builds and applications. Click a project card to view full details.");

  useEffect(() => {
    const fetchData = async () => {
      const { data: contentData } = await supabase.from("projects_content").select("*").single();
      if (contentData) {
        if (contentData.title) setSectionTitle(contentData.title);
        if (contentData.subtitle) setSectionSubtitle(contentData.subtitle);
      }
      
      const { data: projData } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (projData && projData.length > 0) {
        const mapped: ProjectItem[] = projData.map((p: any) => ({
          src: p.image_url || "",
          alt: p.title || "",
          dist: p.stack || "",
          elev: p.tool || "",
          time: p.year || "",
          desc: p.description || "",
          git: p.github_link || "",
          live: p.live_link || "",
          video: p.video_link || "",
        }));
        setProjectsData(mapped);
      }
    };
    fetchData();
  }, []);
  
  const cards = useMemo(() => generateOrbitCards(projectsData), [projectsData]);
  
  return (
    <main
      id="projects"
      className="w-full min-h-screen bg-slate-50 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-black dark"
    >
      <CinematicOrbitHero cards={cards} onCardClick={(index) => setSelectedProjectIndex(index)} sectionTitle={sectionTitle} sectionSubtitle={sectionSubtitle} />

      <AnimatePresence>
        {selectedProjectIndex !== null && (
          <ProjectModal
            cards={cards}
            initialIndex={selectedProjectIndex}
            onClose={() => setSelectedProjectIndex(null)}
          />
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `.no-scrollbar::-webkit-scrollbar { display: none; }`,
        }}
      />
    </main>
  );
}
