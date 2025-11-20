
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { 
  ArrowTopRightOnSquareIcon, 
  GlobeAltIcon, 
  PhotoIcon, 
  FunnelIcon, 
  XMarkIcon,
  CommandLineIcon,
  CpuChipIcon,
  ServerIcon,
  SignalIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export type ProjectType = 'WEB' | 'BOT' | 'API' | 'DATA';
export type ProjectStatus = 'LIVE' | 'BETA' | 'OFFLINE' | 'DEV';

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  githubLink?: string; 
  tags: string[];
  customImage?: string; 
  type?: ProjectType;     
  status?: ProjectStatus; 
}

const StatusBadge = ({ status }: { status?: ProjectStatus }) => {
  const styles = {
    LIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    BETA: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    OFFLINE: 'bg-red-500/10 text-red-400 border-red-500/20',
    DEV: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  
  const s = status || 'LIVE';
  
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1.5 ${styles[s]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s === 'LIVE' ? 'bg-emerald-400 animate-pulse' : s === 'BETA' ? 'bg-yellow-400' : s === 'DEV' ? 'bg-blue-400' : 'bg-red-400'}`}></span>
      {s}
    </span>
  );
};

const TypeIcon = ({ type }: { type?: ProjectType }) => {
  switch (type) {
    case 'BOT': return <CommandLineIcon className="w-4 h-4" />;
    case 'API': return <ServerIcon className="w-4 h-4" />;
    case 'DATA': return <CpuChipIcon className="w-4 h-4" />;
    default: return <GlobeAltIcon className="w-4 h-4" />;
  }
};

// GitHub Icon Component
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const ProjectCard = ({ project, onTagClick }: { project: Project, onTagClick: (tag: string) => void }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // High-Res + Delayed Capture Logic
  // width/1200: High resolution
  // crop/800: Focus on the main fold
  // wait/20: Wait 20 seconds for loaders/animations to finish
  // refresh/1: Try to get a fresh image if possible (though throttled on free tier)
  const screenshotUrl = project.customImage 
    ? project.customImage 
    : `https://image.thum.io/get/width/1200/crop/800/wait/20/noanimate/${project.link}`;

  return (
    <div className="group relative flex flex-col h-full bg-[#09090b] border border-zinc-800 rounded-xl overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
        {/* Technical Header */}
        <div className="h-9 bg-[#0c0c0e] border-b border-zinc-800 flex items-center justify-between px-3 z-20 relative">
            <div className="flex items-center gap-2">
               <div className="text-zinc-500">
                 <TypeIcon type={project.type} />
               </div>
               <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                 {project.type || 'WEB APP'}
               </span>
            </div>
            <StatusBadge status={project.status} />
        </div>

        {/* Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#050505] border-b border-zinc-800 group-hover:border-blue-500/50 transition-colors">
            {/* Clickable Area for Main Link */}
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 block cursor-pointer">
                {/* Loading State */}
                {isLoading && !imageError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 bg-[#050505] z-10">
                        <div className="w-8 h-8 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                        <span className="text-[10px] font-mono animate-pulse text-blue-500">CAPTURING INTERFACE...</span>
                    </div>
                )}

                {/* Fallback State (Professional System Card) if Image Fails */}
                {imageError ? (
                    <div className="absolute inset-0 bg-[#080808] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                        {/* Animated Background Grid */}
                        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 animate-pulse"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-12 h-12 mb-3 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <ShieldCheckIcon className="w-6 h-6 text-zinc-600" />
                            </div>
                            <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">ENCRYPTED SIGNAL</span>
                            <span className="text-zinc-300 text-xs font-bold font-mono block border border-zinc-800 bg-zinc-900/50 px-2 py-1 rounded">
                                PREVIEW UNAVAILABLE
                            </span>
                            <p className="text-[9px] text-zinc-600 mt-2 max-w-[150px]">
                                Connection secure. Visual interface requires direct access.
                            </p>
                        </div>
                    </div>
                ) : (
                    <img 
                        src={screenshotUrl} 
                        alt={project.title}
                        loading="lazy"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setImageError(true);
                            setIsLoading(false);
                        }}
                        className={`
                        absolute inset-0 w-full h-full object-cover object-top 
                        transform transition-transform duration-700 ease-out
                        group-hover:scale-110 
                        opacity-100
                        ${isLoading ? 'opacity-0' : 'opacity-100'}
                        `}
                    />
                )}
            </a>

            {/* CRT Scanline Texture Overlay (Static) */}
            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]"></div>

            {/* Sweeping Beam Overlay (Animated) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-[100%] transition-all duration-1000 pointer-events-none z-20"></div>

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-30 pointer-events-none">
                 <div className="transform scale-90 group-hover:scale-100 transition-transform duration-300 pointer-events-auto">
                     <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                        Launch App <ArrowTopRightOnSquareIcon className="ml-2 w-4 h-4" />
                     </a>
                 </div>
                 
                 {project.githubLink && (
                     <div className="transform scale-90 group-hover:scale-100 transition-transform duration-300 delay-75 pointer-events-auto">
                         <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-widest rounded hover:bg-white hover:text-black transition-colors border border-zinc-700">
                            <GitHubIcon className="w-4 h-4" />
                         </a>
                     </div>
                 )}
            </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col bg-[#09090b] z-20 relative">
            <div className="mb-4">
                <h3 className="text-base font-bold text-zinc-100 mb-2 group-hover:text-blue-400 transition-colors line-clamp-1 font-mono">
                    {project.title}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 group-hover:text-zinc-400 transition-colors">
                    {project.description}
                </p>
            </div>

            <div className="mt-auto pt-4 border-t border-zinc-800/50 flex flex-wrap gap-2">
                {project.tags.map(tag => (
                    <button 
                        key={tag} 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onTagClick(tag);
                        }}
                        className="px-2 py-1 text-[9px] uppercase tracking-wider font-medium text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded hover:text-blue-400 hover:border-blue-500/30 transition-all cursor-pointer"
                    >
                        #{tag}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export const ProjectGrid = ({ projects }: { projects: Project[] }) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    const element = document.getElementById('project-grid-anchor');
    if (element) {
        const offset = 80; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const filteredProjects = activeTag 
    ? projects.filter(p => p.tags.includes(activeTag)) 
    : projects;

  return (
    <div id="project-grid-anchor" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      
      {/* Filter Controls */}
      <div className={`flex items-center justify-between mb-8 transition-all duration-500 ${activeTag ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 hidden'}`}>
         <div className="flex items-center space-x-3 text-sm bg-zinc-900/80 px-4 py-2 rounded border border-zinc-800">
            <FunnelIcon className="w-4 h-4 text-blue-500" />
            <span className="text-zinc-500 uppercase text-[10px] tracking-wider">Active Filter:</span>
            <span className="text-blue-400 font-mono font-bold text-xs">{activeTag}</span>
         </div>
         <button 
            onClick={() => setActiveTag(null)}
            className="flex items-center space-x-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-red-400 transition-colors"
         >
            <XMarkIcon className="w-3 h-3" />
            <span>Reset</span>
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onTagClick={handleTagClick} />
        ))}
      </div>

      {/* Empty State - Professional System Style */}
      {projects.length === 0 && !activeTag && (
           <div className="flex flex-col items-center justify-center py-32 text-zinc-600 border border-zinc-800/50 rounded-xl bg-zinc-900/10">
              <div className="w-16 h-16 mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
                <ServerIcon className="w-8 h-8 opacity-30 text-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-zinc-300 font-mono mb-2">SYSTEM ONLINE</h3>
              <p className="mb-6 font-mono text-xs text-zinc-500 uppercase tracking-wider">Awaiting Project Deployment...</p>
              <div className="flex items-center space-x-2 px-3 py-1 bg-zinc-900 rounded border border-zinc-800">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-zinc-500 font-mono">DB CONNECTED</span>
              </div>
          </div>
      )}

      {/* Empty State - Filtered */}
      {filteredProjects.length === 0 && activeTag && (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-600 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
              <FunnelIcon className="w-10 h-10 mb-4 opacity-20" />
              <p className="mb-4 font-mono text-sm">System: No modules found for tag <span className="text-blue-500">"{activeTag}"</span></p>
              <button 
                onClick={() => setActiveTag(null)} 
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded transition-colors"
              >
                  RESET FILTER
              </button>
          </div>
      )}
    </div>
  )
}
