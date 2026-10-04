import { NextResponse } from 'next/server';

// Mock data for projects
const projects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with Next.js, Stripe, and PostgreSQL.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'Stripe'],
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://ecommerce.demo.com',
  },
  {
    id: '2',
    title: 'AI Chat Application',
    description: 'Real-time chat application powered by Gemini AI with multimodal capabilities.',
    techStack: ['React', 'Node.js', 'Socket.io', 'Gemini API'],
    githubUrl: 'https://github.com/yourusername/aichat',
    liveUrl: 'https://aichat.demo.com',
  },
  {
    id: '3',
    title: 'SaaS Dashboard',
    description: 'Analytics dashboard for SaaS companies featuring complex data visualizations.',
    techStack: ['Next.js', 'Tailwind', 'Recharts', 'Supabase'],
    githubUrl: 'https://github.com/yourusername/saas-dashboard',
    liveUrl: 'https://saas-dashboard.demo.com',
  }
];

export async function GET() {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    success: true,
    data: projects,
  });
}
