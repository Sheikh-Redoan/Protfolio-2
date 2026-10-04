'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WordsPullUp } from '@/components/ui/WordsPullUp';
import styles from './HeroSection.module.css';
import { supabase } from '@/lib/supabaseClient';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.6
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function HeroSection() {
  const { scrollY } = useScroll();
  
  // Transform scroll position into CSS values
  const padding = useTransform(scrollY, [0, 300], ['16px', '0px']);
  const borderRadius = useTransform(scrollY, [0, 300], ['24px', '0px']);

  // State for Supabase Data
  const [data, setData] = useState({
    title: "Sheikh Redoan",
    designation: "Frontend Developer",
    description: "Frontend Developer (React/Next.js) turning complex designs into fast, interactive experiences with clean, maintainable code.",
    cta_text: "View my work",
    cta_link: "#projects",
    media_url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
  });

  useEffect(() => {
    const fetchHeroContent = async () => {
      const { data: heroData, error } = await supabase
        .from("hero_content")
        .select("*")
        .single();
      
      if (heroData) {
        setData(heroData);
      }
    };
    
    fetchHeroContent();
  }, []);

  const isVideo = data.media_url.match(/\.(mp4|webm|ogg)$/i) || data.media_url.includes("cloudfront.net");

  return (
    <motion.section 
      id="hero" 
      className={styles.heroSection}
      style={{ padding }}
    >
      <motion.div 
        className={styles.videoContainer}
        style={{ borderRadius }}
      >
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles.video}
            src={data.media_url}
          />
        ) : (
          <img
            src={data.media_url}
            alt="Hero Background"
            className={styles.video}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        )}

        {/* Noise overlay */}
        <div className={styles.noiseOverlay} />

        {/* Gradient overlay */}
        <div className={styles.gradientOverlay} />

        <div className={styles.contentContainer}>
          <div className={styles.gridContainer}>
            
            {/* Title Section */}
            <div className={styles.titleWrapper}>
              <h1 className={styles.mainTitle} style={{ color: "#E1E0CC" }}>
                <WordsPullUp text={data.title} showAsterisk />
              </h1>
            </div>

            {/* Description & Action Section */}
            <motion.div 
              className={styles.descWrapper}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                variants={itemVariants} 
                className={styles.designation}
              >
                {data.designation}
              </motion.h2>
              <motion.p 
                variants={itemVariants} 
                className={styles.description}
              >
                {data.description}
              </motion.p>

              <motion.a 
                variants={itemVariants} 
                href={data.cta_link} 
                className={styles.ctaButton}
              >
                {data.cta_text}
                <span className={styles.ctaIconWrapper}>
                  <ArrowRight className={styles.arrowIcon} style={{ color: "#E1E0CC" }} />
                </span>
              </motion.a>

            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
