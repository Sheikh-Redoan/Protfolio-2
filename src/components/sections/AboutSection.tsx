'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  const [data, setData] = useState({
    image_url: "https://azadrhqkhtmeqfyndjak.supabase.co/storage/v1/object/public/portfolio-images/MyImage.jpg",
    title: "Behind the \n code.",
    paragraph_1: "I am a Frontend Developer turning complex designs into fast, interactive experiences with clean, maintainable code. My work lives at the intersection of aesthetic design and robust technical architecture.",
    paragraph_2: "With a strong background in leading cross-functional teams at Softvence Agency, I specialize in building scalable React/Next.js apps, real-time dashboards, and converting Figma designs into pixel-perfect interfaces that boost user retention and brand consistency.",
    skills: "React.js, Next.js, TypeScript, Tailwind CSS, GSAP / Three.js",
    show_skills: true
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      const { data: aboutData, error } = await supabase
        .from("about_content")
        .select("*")
        .single();
      
      if (aboutData) {
        setData(aboutData);
      }
    };
    
    fetchAboutData();
  }, []);

  // Format the title to support \n line breaks
  const formattedTitle = data.title.split('\\n').map((line, index, array) => (
    <span key={index}>
      {line}
      {index !== array.length - 1 && <br />}
    </span>
  ));

  // Parse skills string into array
  const skillsArray = data.skills.split(',').map(skill => skill.trim()).filter(Boolean);

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
                src={data.image_url}
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
              {data.title.includes('\n') ? data.title.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i !== arr.length - 1 && <br/>}</span>
              )) : formattedTitle}
            </h2>
            
            <div className={styles.paragraphs}>
              <p>{data.paragraph_1}</p>
              <p>{data.paragraph_2}</p>
            </div>
            
            {data.show_skills && (
              <div className={styles.skillsContainer}>
                {skillsArray.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className={styles.skillTag}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
