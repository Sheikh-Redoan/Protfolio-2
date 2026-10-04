'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { useLenis } from 'lenis/react';

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" }
];

export default function Navbar() {
  const lenis = useLenis();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      
      if (lenis) {
        lenis.scrollTo(href);
      } else {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navInner}>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={styles.navLink}
            onClick={(e) => handleScroll(e, item.href)}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)")}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
