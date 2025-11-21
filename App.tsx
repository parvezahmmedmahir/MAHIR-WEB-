
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Hero } from './components/Hero';
import { ProjectGrid, Project } from './components/ProjectGrid';
import { AboutMe } from './components/AboutMe';
import { ProjectManager } from './components/ProjectManager';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { supabase } from './services/supabase';

// PRELOADED PROJECTS (User Requested)
const PRELOADED_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'QTB X-MAHIR BOT PRO V3',
    description: 'Advanced automated trading system with signal processing capabilities.',
    link: 'https://superlative-granita-a6c924.netlify.app/',
    githubLink: 'https://github.com/parvezahmmedmahir/QTB-X-MAHIR-BOT-PRO-V3.git',
    tags: ['TRADING', 'BOT', 'AUTOMATION'],
    type: 'BOT',
    status: 'LIVE'
  },
  {
    id: 'p2',
    title: 'QTB X-MAHIR BOT PRO V4',
    description: 'Next-generation trading algorithm optimized for high-frequency markets.',
    link: 'https://qtb-x-mahir-bot-pro-v4.vercel.app/',
    githubLink: 'https://github.com/parvezahmmedmahir/QTB-X-MAHIR-BOT-PRO-V4.git',
    tags: ['ALGO', 'FOREX', 'V4'],
    type: 'BOT',
    status: 'LIVE'
  },
  {
    id: 'p3',
    title: 'MAHIR X FALCON Ai v3',
    description: 'AI-driven market analysis tool integrating Falcon architecture.',
    link: 'https://helpful-mandazi-7af544.netlify.app/',
    githubLink: 'https://github.com/parvezahmmedmahir/MAHIR-X-FALCON-Ai-V3.git',
    tags: ['AI', 'PREDICTION', 'NEURAL'],
    type: 'DATA',
    status: 'LIVE'
  },
  {
    id: 'p4',
    title: 'MAHIR X FALCON Ai v7',
    description: 'Enhanced AI V7 utilizing Gemini integration for deeper market insights.',
    link: 'https://mahir-x-falcon-ai-v7-gemini.vercel.app/',
    githubLink: 'https://github.com/parvezahmmedmahir/MAHIR-X-FALCON-AI-V7-GEMINI-.git',
    tags: ['GEMINI', 'AI', 'TRADING'],
    type: 'BOT',
    status: 'LIVE'
  },
  {
    id: 'p5',
    title: 'MAHIR X FALCON AI v8',
    description: 'The latest V8 iteration of the Falcon AI series with real-time data processing.',
    link: 'https://mahir-x-falcon-ai-v8-gemini.vercel.app/',
    githubLink: 'https://github.com/parvezahmmedmahir/MAHIR-X-FALCON-AI-V8-GEMINI-.git',
    tags: ['REALTIME', 'AI', 'V8'],
    type: 'BOT',
    status: 'BETA'
  },
  {
    id: 'p6',
    title: 'MAHIR VIP AUTO AI',
    description: 'Premium binary signals automation for VIP market segments.',
    link: 'https://mahir-vip-vi.netlify.app/',
    githubLink: 'https://github.com/parvezahmmedmahir/MAHIR-VIP-AUTO-AI---Premium-Binary-Signals.git',
    tags: ['VIP', 'SIGNALS', 'BINARY'],
    type: 'API',
    status: 'LIVE'
  },
  {
    id: 'p7',
    title: 'QTB-X-MAHIR-BOT-PRO-V7.1',
    description: 'Professional grade bot V7.1 with stability patches and new indicators.',
    link: 'https://qtb-x-mahir-v7.netlify.app/',
    githubLink: 'https://github.com/parvezahmmedmahir/-QTB-X-MAHIR-BOT-PRO-V7.1.git',
    tags: ['PRO', 'STABLE', 'V7.1'],
    type: 'BOT',
    status: 'LIVE'
  }
];

const App: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>(PRELOADED_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [showPreloaded, setShowPreloaded] = useState(true);

  // FETCH DATA FROM SUPABASE
  const fetchProjects = async () => {
    try {
        setLoading(true);
        
        // 1. Fetch Profile Settings (to check if we should show defaults)
        const { data: profileData } = await supabase.from('profile').select('show_preloaded').single();
        const shouldShowPreloaded = profileData ? profileData.show_preloaded !== false : true;
        setShowPreloaded(shouldShowPreloaded);

        // 2. Fetch DB Projects
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
          console.warn("Supabase fetch warning (using static projects):", error.message);
        }

        let allProjects: Project[] = [];
        
        if (data && data.length > 0) {
            const formattedData = data.map((p: any) => ({
                ...p,
                tags: Array.isArray(p.tags) ? p.tags : [] 
            }));
            allProjects = [...formattedData];
        }

        if (shouldShowPreloaded) {
            allProjects = [...allProjects, ...PRELOADED_PROJECTS];
        }

        setProjects(allProjects);

    } catch (e) {
        console.error("Failed to fetch projects:", e);
        // Fallback
        setProjects(PRELOADED_PROJECTS);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    window.addEventListener('project-updated', fetchProjects);
    window.addEventListener('profile-updated', fetchProjects); // Listen for toggle changes
    return () => {
        window.removeEventListener('project-updated', fetchProjects);
        window.removeEventListener('profile-updated', fetchProjects);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] bg-dot-grid text-zinc-50 selection:bg-blue-500/30 flex flex-col">
      <SpeedInsights />
      
      {/* Hero Section */}
      <div className="relative pb-16 pt-12 md:pt-20">
         <Hero />
      </div>

      {/* Biography Section */}
      <div id="about-section" className="relative z-10 bg-gradient-to-b from-transparent via-[#0a0a0a] to-[#050505]">
        <AboutMe />
      </div>

      {/* Projects Grid Section */}
      <div className="relative z-10 flex-1 bg-[#050505]">
        {/* Section Header */}
        <div className="flex items-center justify-center mb-8 md:mb-12 pt-8 flex-col gap-2">
           <div className="flex items-center">
              <div className="h-px w-8 md:w-20 bg-zinc-800 mr-4"></div>
              <span className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-emerald-500'} animate-pulse`}></span>
                  System Deployments
              </span>
              <div className="h-px w-8 md:w-20 bg-zinc-800 ml-4"></div>
           </div>
        </div>
        
        {/* Grid Component */}
        <ProjectGrid projects={projects} loading={loading} />
      </div>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-zinc-900 mt-auto bg-zinc-950 relative z-10">
        <div className="flex items-center justify-center space-x-4 mb-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             <span className="text-zinc-500 text-xs font-mono tracking-wider">
                SYSTEMS ONLINE • MAHIR WEB
             </span>
        </div>
        <p className="text-zinc-600 text-sm font-mono mb-4">
          © {new Date().getFullYear()} MAHIR WEB. Designed & Deployed by Mahir Chowdhury.
        </p>

        {/* Admin Tools Toggle */}
        <button 
          onClick={() => setShowAdmin(true)}
          className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-widest text-zinc-800 hover:text-zinc-500 transition-colors"
        >
          <WrenchScrewdriverIcon className="w-3 h-3" />
          <span>Manager Mode</span>
        </button>
      </footer>

      {/* Admin Panel Modal */}
      {showAdmin && <ProjectManager onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

export default App;
