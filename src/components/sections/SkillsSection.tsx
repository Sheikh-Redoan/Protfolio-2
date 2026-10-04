'use client';

import React, { forwardRef, useRef, useEffect, useState } from "react";
import { AnimatedBeam } from "@/components/ui/AnimatedBeam";
import { Icons } from "@/components/ui/Icons";
import styles from "./SkillsSection.module.css";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

// A small helper to safely render an icon from the Icons file by its string name, or an external image URL
const renderIcon = (iconName: string) => {
  if (!iconName) return <Icons.React />;
  
  if (iconName.startsWith("http")) {
    return <img src={iconName} alt="Skill icon" style={{ width: "100%", height: "100%", objectFit: "contain" }} />;
  }

  const IconComponent = (Icons as any)[iconName];
  if (IconComponent) {
    return <IconComponent />;
  }
  // Fallback to React icon if it doesn't exist
  return <Icons.React />;
};

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
  const leftRefs = [l1Ref, l2Ref, l3Ref, l4Ref, l5Ref];
  
  // Right Column Refs
  const r1Ref = useRef<HTMLDivElement>(null);
  const r2Ref = useRef<HTMLDivElement>(null);
  const r3Ref = useRef<HTMLDivElement>(null);
  const r4Ref = useRef<HTMLDivElement>(null);
  const r5Ref = useRef<HTMLDivElement>(null);
  const rightRefs = [r1Ref, r2Ref, r3Ref, r4Ref, r5Ref];
  
  // Center Ref
  const centerRef = useRef<HTMLDivElement>(null);

  // Default hardcoded state so layout works while fetching
  const [data, setData] = useState({
    title: "Core Expertise",
    subtitle: "My technical foundation powering interactive experiences.",
    center_image: "",
    left_skills: [
      { label: "React.js", icon: "React", color: "rgba(97, 218, 251, 0.5)", beamColor: "#61dafb" },
      { label: "JavaScript", icon: "JavaScript", color: "rgba(247, 223, 30, 0.5)", beamColor: "#f7df1e" },
      { label: "TypeScript", icon: "TypeScript", color: "rgba(49, 120, 198, 0.5)", beamColor: "#3178C6" },
      { label: "GSAP", icon: "GSAP", color: "rgba(136, 206, 2, 0.5)", beamColor: "#88ce02" },
      { label: "Three.js", icon: "ThreeJS", color: "rgba(255, 255, 255, 0.5)", beamColor: "#ffffff" }
    ],
    right_skills: [
      { label: "Next.js", icon: "NextJS", color: "rgba(255, 255, 255, 0.5)", beamColor: "#ffffff" },
      { label: "HTML", icon: "HTML", color: "rgba(227, 79, 38, 0.5)", beamColor: "#e34f26" },
      { label: "Tailwind", icon: "Tailwind", color: "rgba(56, 189, 248, 0.5)", beamColor: "#38BDF8" },
      { label: "Git", icon: "Git", color: "rgba(241, 80, 47, 0.5)", beamColor: "#F1502F" },
      { label: "GitHub", icon: "GitHub", color: "rgba(255, 255, 255, 0.5)", beamColor: "#ffffff" }
    ]
  });

  useEffect(() => {
    const fetchSkills = async () => {
      const { data: dbData } = await supabase.from("skills_content").select("*").single();
      if (dbData) {
        setData(dbData);
      }
    };
    fetchSkills();
  }, []);

  // Animation values for beams
  const curvatures = [-75, -35, 0, 35, 75];
  const endYOffsets = [-20, -10, 0, 10, 20];
  const delays = [0, 0.4, 0.8, 1.2, 1.6];
  const rightDelays = [0.2, 0.6, 1.0, 1.4, 1.8];

  return (
    <section id="skills" className={styles.section}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <h2 className={styles.heading}>{data.title}</h2>
        <p className={styles.subtitle}>{data.subtitle}</p>
        
        <div className={styles.skillsWrapper} ref={containerRef}>
          {/* Left Column */}
          <div className={styles.column}>
            {data.left_skills.map((skill, i) => (
              <div key={`left-${i}`} className={styles.skillNode}>
                <Circle ref={leftRefs[i]} className={styles.skillCircle} style={{ "--hover-color": skill.color } as React.CSSProperties}>
                  <div className={styles.icon}>{renderIcon(skill.icon)}</div>
                </Circle>
                <span className={styles.skillLabel}>{skill.label}</span>
              </div>
            ))}
          </div>

          {/* Center Column */}
          <div className={styles.centerColumn}>
            <Circle ref={centerRef} className={styles.centerCircle}>
              {data.center_image ? (
                <img src={data.center_image} alt="Center Logo" style={{ width: 80, height: 80, objectFit: 'contain' }} className={styles.icon} />
              ) : (
                <div className={styles.icon}><Icons.React /></div> 
              )}
            </Circle>
          </div>

          {/* Right Column */}
          <div className={styles.column}>
            {data.right_skills.map((skill, i) => (
              <div key={`right-${i}`} className={styles.skillNode}>
                <Circle ref={rightRefs[i]} className={styles.skillCircle} style={{ "--hover-color": skill.color } as React.CSSProperties}>
                  <div className={styles.icon}>{renderIcon(skill.icon)}</div>
                </Circle>
                <span className={styles.skillLabel}>{skill.label}</span>
              </div>
            ))}
          </div>

          {/* Animated Beams - Left Side */}
          {data.left_skills.map((skill, i) => (
            <AnimatedBeam 
              key={`beam-left-${i}`}
              containerRef={containerRef} 
              fromRef={leftRefs[i]} 
              toRef={centerRef} 
              delay={delays[i]} 
              curvature={curvatures[i]} 
              endYOffset={endYOffsets[i]} 
              pathColor="rgba(255,255,255,0.15)" 
              pathOpacity={1} 
              gradientStartColor={skill.beamColor || "#ffffff"} 
              gradientStopColor="#000" 
            />
          ))}

          {/* Animated Beams - Right Side */}
          {data.right_skills.map((skill, i) => (
            <AnimatedBeam 
              key={`beam-right-${i}`}
              containerRef={containerRef} 
              fromRef={rightRefs[i]} 
              toRef={centerRef} 
              delay={rightDelays[i]} 
              curvature={curvatures[i]} 
              endYOffset={endYOffsets[i]} 
              reverse 
              pathColor="rgba(255,255,255,0.15)" 
              pathOpacity={1} 
              gradientStartColor={skill.beamColor || "#ffffff"} 
              gradientStopColor="#000" 
            />
          ))}

        </div>
      </motion.div>
    </section>
  );
}
