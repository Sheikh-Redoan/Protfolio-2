'use client';

import React, { forwardRef, useRef } from "react";
import { AnimatedBeam } from "@/components/ui/AnimatedBeam";
import { Icons } from "@/components/ui/Icons";
import styles from "./SkillsSection.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../../../public/skills/Frontend-Developer.png"
const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode; style?: React.CSSProperties }>(
  ({ className = "", children, style }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.circle} ${className}`}
        style={style}
      >
        {children}
      </div>
    );
  }
);
Circle.displayName = "Circle";

export default function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Left Column Refs
  const l1Ref = useRef<HTMLDivElement>(null);
  const l2Ref = useRef<HTMLDivElement>(null);
  const l3Ref = useRef<HTMLDivElement>(null);
  const l4Ref = useRef<HTMLDivElement>(null);
  const l5Ref = useRef<HTMLDivElement>(null);
  
  // Right Column Refs
  const r1Ref = useRef<HTMLDivElement>(null);
  const r2Ref = useRef<HTMLDivElement>(null);
  const r3Ref = useRef<HTMLDivElement>(null);
  const r4Ref = useRef<HTMLDivElement>(null);
  const r5Ref = useRef<HTMLDivElement>(null);
  
  // Center Ref
  const centerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="skills" className={styles.section}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <h2 className={styles.heading}>Core Expertise</h2>
        <p className={styles.subtitle}>My technical foundation powering interactive experiences.</p>
        
        <div className={styles.skillsWrapper} ref={containerRef}>
          {/* Left Column */}
          <div className={styles.column}>
            <div className={styles.skillNode}>
              <Circle ref={l1Ref} className={styles.skillCircle} style={{ "--hover-color": "rgba(97, 218, 251, 0.5)" } as React.CSSProperties}>
                <div className={styles.icon}><Icons.React /></div>
              </Circle>
              <span className={styles.skillLabel}>React.js</span>
            </div>
            
            <div className={styles.skillNode}>
              <Circle ref={l2Ref} className={styles.skillCircle} style={{ "--hover-color": "rgba(247, 223, 30, 0.5)" } as React.CSSProperties}>
                <div className={styles.icon}><Icons.JavaScript /></div>
              </Circle>
              <span className={styles.skillLabel}>JavaScript</span>
            </div>

            <div className={styles.skillNode}>
              <Circle ref={l3Ref} className={styles.skillCircle} style={{ "--hover-color": "rgba(49, 120, 198, 0.5)" } as React.CSSProperties}>
                <div className={styles.icon}><Icons.TypeScript /></div>
              </Circle>
              <span className={styles.skillLabel}>TypeScript</span>
            </div>

            <div className={styles.skillNode}>
              <Circle ref={l4Ref} className={styles.skillCircle} style={{ "--hover-color": "rgba(136, 206, 2, 0.5)" } as React.CSSProperties}>
                <div className={styles.icon}><Icons.GSAP /></div>
              </Circle>
              <span className={styles.skillLabel}>GSAP</span>
            </div>

            <div className={styles.skillNode}>
              <Circle ref={l5Ref} className={styles.skillCircle} style={{ "--hover-color": "rgba(255, 255, 255, 0.5)" } as React.CSSProperties}>
                <div className={styles.icon}><Icons.ThreeJS /></div>
              </Circle>
              <span className={styles.skillLabel}>Three.js</span>
            </div>
          </div>

          {/* Center Column */}
          <div className={styles.centerColumn}>
            <Circle ref={centerRef} className={styles.centerCircle}>
              <Image src={logo} alt="Frontend Dev" width={80} height={80} className={styles.icon} />
              {/* <span className={styles.centerText}>Frontend<br/>Dev</span> */}
            </Circle>
          </div>

          {/* Right Column */}
          <div className={styles.column}>
            <div className={styles.skillNode}>
              <Circle ref={r1Ref} className={styles.skillCircle} style={{ "--hover-color": "rgba(255, 255, 255, 0.5)" } as React.CSSProperties}>
                <div className={styles.icon}><Icons.NextJS /></div>
              </Circle>
              <span className={styles.skillLabel}>Next.js</span>
            </div>

            <div className={styles.skillNode}>
              <Circle ref={r2Ref} className={styles.skillCircle} style={{ "--hover-color": "rgba(227, 79, 38, 0.5)" } as React.CSSProperties}>
                <div className={styles.icon}><Icons.HTML /></div>
              </Circle>
              <span className={styles.skillLabel}>HTML</span>
            </div>

            <div className={styles.skillNode}>
              <Circle ref={r3Ref} className={styles.skillCircle} style={{ "--hover-color": "rgba(56, 189, 248, 0.5)" } as React.CSSProperties}>
                <div className={styles.icon}><Icons.Tailwind /></div>
              </Circle>
              <span className={styles.skillLabel}>Tailwind</span>
            </div>

            <div className={styles.skillNode}>
              <Circle ref={r4Ref} className={styles.skillCircle} style={{ "--hover-color": "rgba(241, 80, 47, 0.5)" } as React.CSSProperties}>
                <div className={styles.icon}><Icons.Git /></div>
              </Circle>
              <span className={styles.skillLabel}>Git</span>
            </div>

            <div className={styles.skillNode}>
              <Circle ref={r5Ref} className={styles.skillCircle} style={{ "--hover-color": "rgba(255, 255, 255, 0.5)" } as React.CSSProperties}>
                <div className={styles.icon}><Icons.GitHub /></div>
              </Circle>
              <span className={styles.skillLabel}>GitHub</span>
            </div>
          </div>

          {/* Animated Beams - Left Side */}
          <AnimatedBeam containerRef={containerRef} fromRef={l1Ref} toRef={centerRef} delay={0} curvature={-75} endYOffset={-20} pathColor="rgba(255,255,255,0.15)" pathOpacity={1} gradientStartColor="#61dafb" gradientStopColor="#000" />
          <AnimatedBeam containerRef={containerRef} fromRef={l2Ref} toRef={centerRef} delay={0.4} curvature={-35} endYOffset={-10} pathColor="rgba(255,255,255,0.15)" pathOpacity={1} gradientStartColor="#f7df1e" gradientStopColor="#000" />
          <AnimatedBeam containerRef={containerRef} fromRef={l3Ref} toRef={centerRef} delay={0.8} curvature={0} endYOffset={0} pathColor="rgba(255,255,255,0.15)" pathOpacity={1} gradientStartColor="#3178C6" gradientStopColor="#000" />
          <AnimatedBeam containerRef={containerRef} fromRef={l4Ref} toRef={centerRef} delay={1.2} curvature={35} endYOffset={10} pathColor="rgba(255,255,255,0.15)" pathOpacity={1} gradientStartColor="#88ce02" gradientStopColor="#000" />
          <AnimatedBeam containerRef={containerRef} fromRef={l5Ref} toRef={centerRef} delay={1.6} curvature={75} endYOffset={20} pathColor="rgba(255,255,255,0.15)" pathOpacity={1} gradientStartColor="#ffffff" gradientStopColor="#000" />

          {/* Animated Beams - Right Side */}
          <AnimatedBeam containerRef={containerRef} fromRef={r1Ref} toRef={centerRef} delay={0.2} curvature={-75} endYOffset={-20} reverse pathColor="rgba(255,255,255,0.15)" pathOpacity={1} gradientStartColor="#ffffff" gradientStopColor="#000" />
          <AnimatedBeam containerRef={containerRef} fromRef={r2Ref} toRef={centerRef} delay={0.6} curvature={-35} endYOffset={-10} reverse pathColor="rgba(255,255,255,0.15)" pathOpacity={1} gradientStartColor="#e34f26" gradientStopColor="#000" />
          <AnimatedBeam containerRef={containerRef} fromRef={r3Ref} toRef={centerRef} delay={1.0} curvature={0} endYOffset={0} reverse pathColor="rgba(255,255,255,0.15)" pathOpacity={1} gradientStartColor="#38BDF8" gradientStopColor="#000" />
          <AnimatedBeam containerRef={containerRef} fromRef={r4Ref} toRef={centerRef} delay={1.4} curvature={35} endYOffset={10} reverse pathColor="rgba(255,255,255,0.15)" pathOpacity={1} gradientStartColor="#F1502F" gradientStopColor="#000" />
          <AnimatedBeam containerRef={containerRef} fromRef={r5Ref} toRef={centerRef} delay={1.8} curvature={75} endYOffset={20} reverse pathColor="rgba(255,255,255,0.15)" pathOpacity={1} gradientStartColor="#ffffff" gradientStopColor="#000" />

        </div>
      </motion.div>
    </section>
  );
}
