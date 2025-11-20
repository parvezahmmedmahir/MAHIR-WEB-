
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ProjectGrid, Project } from './components/ProjectGrid';
import { AboutMe } from './components/AboutMe';
import { ProjectManager } from './components/ProjectManager';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

// ==================================================================================
// 🟢 SYSTEM DATABASE (MANUAL INPUT)
// ==================================================================================
// INSTRUCTIONS:
// 1. Open "Manager Mode" in the website footer.
// 2. Generate your project.
// 3. Copy the code snippet provided.
// 4. Paste it inside the array below (at the top).
// ==================================================================================

const PERMANENT_PROJECTS: Project[] = [
  // [PASTE NEW PROJECTS HERE] ------------------------------------------------------
  
  {
    id: 'sys-001',
    title: 'High-Frequency Trading Bot',
    description: 'Automated arbitrage system monitoring Binance and Kraken spreads in real-time.',
    link: 'https://github.com',
    tags: ['Python', 'Algo', 'Socket.io'],
    type: 'BOT',
    status: 'LIVE'
  },
  {
    id: 'sys-002',
    title: 'DeFi Yield Aggregator',
    description: 'Smart contract interface for optimizing yield farming strategies across multiple chains.',
    link: 'https://github.com',
    tags: ['Solidity', 'React', 'Web3'],
    type: 'WEB',
    status: 'BETA'
  },
  {
    id: 'sys-003',
    title: 'GPU Mining Monitor',
    description: 'Telemetry dashboard for mining rig thermal performance and hashrate optimization.',
    link: 'https://github.com',
    tags: ['C++', 'Dashboard', 'IoT'],
    type: 'DATA',
    status: 'LIVE'
  },
  
  // --------------------------------------------------------------------------------
];

// ==================================================================================


const App: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>(PERMANENT_PROJECTS);

  // Load LocalStorage Projects (For Admin Testing)
  // This allows you to see projects you add via the Manager immediately
  // without needing to edit the code right away.
  useEffect(() => {
    const loadLocalProjects = () => {
      const saved = localStorage.getItem('mahir_local_projects');
      if (saved) {
        try {
          const localProjects = JSON.parse(saved);
          // Merge local projects with permanent ones (Local first to show newest)
          // We filter out duplicates based on ID if any exist
          const uniquePermanent = PERMANENT_PROJECTS.filter(p => !localProjects.some((l: Project) => l.id === p.id));
          setProjects([...localProjects, ...uniquePermanent]);
        } catch (e) {
          console.error("Failed to load local projects", e);
        }
      } else {
        setProjects(PERMANENT_PROJECTS);
      }
    };

    loadLocalProjects();

    // Listen for updates from ProjectManager
    window.addEventListener('project-updated', loadLocalProjects);
    return () => window.removeEventListener('project-updated', loadLocalProjects);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] bg-dot-grid text-zinc-50 selection:bg-blue-500/30 flex flex-col">
      
      {/* Hero Section */}
      <div className="relative pb-16 pt-12 md:pt-20">
         <Hero />
      </div>

      {/* Biography Section with ID for Scroll Anchor */}
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
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  System Deployments
              </span>
              <div className="h-px w-8 md:w-20 bg-zinc-800 ml-4"></div>
           </div>
        </div>
        
        {/* Grid Component */}
        <ProjectGrid projects={projects} />
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
