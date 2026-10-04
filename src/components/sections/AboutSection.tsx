'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './AboutSection.module.css';
import MyImage from '../../../public/MyImage.jpg'

export default function AboutSection() {
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"]
  });

  // Scroll down animations
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.imageWrapper}
          >
            <motion.div style={{ y: imageY }} className={styles.imageInner}>
              <img
                src={MyImage.src}
                alt="Portrait"
                className={styles.image}
              />
              <div className={styles.imageOverlay}></div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={styles.textWrapper}
            style={{ y: textY }}
          >
            <h2 className={styles.title} style={{ color: "#E1E0CC" }}>
              Behind the <br /> code.
            </h2>
            
            <div className={styles.paragraphs}>
              <p>
                I am a Frontend Developer turning complex designs into fast, interactive experiences with clean, maintainable code. My work lives at the intersection of aesthetic design and robust technical architecture.
              </p>
              <p>
                With a strong background in leading cross-functional teams at Softvence Agency, I specialize in building scalable React/Next.js apps, real-time dashboards, and converting Figma designs into pixel-perfect interfaces that boost user retention and brand consistency.
              </p>
            </div>
            
            <div className={styles.skillsContainer}>
              {["React.js", "Next.js", "TypeScript", "Tailwind CSS", "GSAP / Three.js"].map((skill, idx) => (
                <span 
                  key={idx} 
                  className={styles.skillTag}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
