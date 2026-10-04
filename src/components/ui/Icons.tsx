import Image from "next/image";

export const Icons = {
  React: () => (
    <Image src="/skills/react.png" alt="React" fill style={{ objectFit: "contain" }} />
  ),
  JavaScript: () => (
    <Image src="/skills/javascript.png" alt="JavaScript" fill style={{ objectFit: "contain" }} />
  ),
  TypeScript: () => (
    <Image src="/skills/typescript.png" alt="TypeScript" fill style={{ objectFit: "contain" }} />
  ),
  GSAP: () => (
    <Image src="/skills/gsap.png" alt="GSAP" fill style={{ objectFit: "contain" }} />
  ),
  ThreeJS: () => (
    <Image src="/skills/three.png" alt="ThreeJS" fill style={{ objectFit: "contain" }} />
  ),
  NextJS: () => (
    <Image src="/skills/next-js.png" alt="NextJS" fill style={{ objectFit: "contain" }} />
  ),
  HTML: () => (
    <Image src="/skills/html.png" alt="HTML" fill style={{ objectFit: "contain" }} />
  ),
  Tailwind: () => (
    <Image src="/skills/tailwind.png" alt="Tailwind" fill style={{ objectFit: "contain" }} />
  ),
  Git: () => (
    <Image src="/skills/git.png" alt="Git" fill style={{ objectFit: "contain" }} />
  ),
  GitHub: () => (
    <Image src="/skills/github.png" alt="GitHub" fill style={{ objectFit: "contain" }} />
  )
};
