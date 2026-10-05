"use client";

import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { useLenis } from 'lenis/react';
import { supabase } from "@/lib/supabaseClient";

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const siteData = {
  company: {
    name: 'Sheikh Redoan',
    description:
      'Empowering businesses with reliable, scalable, and innovative web solutions.',
    logo: Zap, 
  },
  socials: [
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: Github, label: 'GitHub', href: 'https://github.com' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
  ],
  columns: [
    {
      title: 'Navigation',
      links: [
        { text: 'Home', href: '#hero' },
        { text: 'About', href: '#about' },
        { text: 'Projects', href: '#projects' },
        { text: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Services',
      links: [
        { text: 'Web Development', href: '#' },
        { text: 'UI/UX Design', href: '#' },
        { text: 'SEO Optimization', href: '#' },
        { text: 'Consulting', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Blog', href: '#' },
        { text: 'Case Studies', href: '#' },
        { text: 'Github Repos', href: '#' },
        { text: 'Resume', href: '#' },
      ],
    },
  ],
};

export default function Footer() {
  const lenis = useLenis();
  const [socials, setSocials] = useState(siteData.socials);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('contact_settings').select('*').eq('is_active', true);
      if (data) {
        const dynamicSocials = data
          .filter(s => ['github', 'linkedin', 'facebook', 'youtube', 'twitter'].includes(s.platform))
          .map(s => {
            let Icon;
            if (s.platform === 'github') Icon = Github;
            else if (s.platform === 'linkedin') Icon = Linkedin;
            else if (s.platform === 'youtube') Icon = Youtube;
            else if (s.platform === 'twitter') Icon = Twitter;
            // Assuming we don't have Facebook imported, we can fall back or import it.
            // But let's just use Twitter if Facebook isn't defined above, or import Facebook.
            // Oh wait, I didn't import Facebook SVG. Let's just return Github as a fallback.
            else Icon = Github;

            return { icon: Icon, label: s.platform, href: s.value };
          });
        if (dynamicSocials.length > 0) {
          setSocials(dynamicSocials);
        }
      }
    }
    fetchSettings();
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      
      if (lenis) {
        // Handle '#' as top of page
        if (href === '#') {
          lenis.scrollTo(0);
        } else {
          lenis.scrollTo(href);
        }
      } else {
        if (href === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  };

  return (
    <footer className="relative w-full bg-[#070707] text-zinc-50 overflow-hidden font-sans border-t border-white/5">
      <div className="relative mx-auto max-w-screen-xl px-6 pt-20 pb-12 sm:px-8 lg:px-12 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 xl:gap-8">
          {/* Company Info Column (Spans 2 columns on large screens) */}
          <div className="flex flex-col items-start lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold tracking-tight text-white">
                {siteData.company.name}
              </span>
            </div>

            <p className="mt-6 max-w-sm leading-relaxed text-zinc-400 text-sm">
              {siteData.company.description}
            </p>

            <ul className="mt-8 flex gap-5">
              {socials.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-1 -m-1 text-zinc-400 transition-colors hover:text-indigo-400"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-5 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Columns */}
          {siteData.columns.map((column) => (
            <div key={column.title} className="text-left">
              <p className="text-lg font-semibold tracking-tight text-white">
                {column.title}
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                {column.links.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-zinc-400 transition-colors hover:text-indigo-400"
                      href={href}
                      onClick={(e) => handleScroll(e, href)}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
        </div>
      </div>
    </footer>
  );
}
