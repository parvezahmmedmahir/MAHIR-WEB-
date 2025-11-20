
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
  SignalIcon
} from '@heroicons/react/24/outline';

export type ProjectType = 'WEB' | 'BOT' | 'API' | 'DATA';
export type ProjectStatus = 'LIVE' | 'BETA' | 'OFFLINE' | 'DEV';

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  customImage?: string; 
  type?: ProjectType;     // New: Classify the project
  status?: ProjectStatus; // New: Live status
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

const ProjectCard = ({ project, onTagClick }: { project: Project, onTagClick: (tag: string) => void }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced Thumbnail Logic
  const screenshotUrl = project.customImage 
    ? project.customImage 
    : `https://image.thum.io/get/width/800/crop/600/noanimate/${project.link}`;

  return (
    <a 
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col h-full bg-[#09090b] border border-zinc-800 rounded-xl overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
    >
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
        
            {/* Loading State */}
            {isLoading && !imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 bg-[#050505] z-10">
                    <div className="w-8 h-8 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                    <span className="text-[10px] font-mono animate-pulse">ESTABLISHING LINK...</span>
                </div>
            )}

            {/* Fallback State (System Card) if Image Fails */}
            {imageError ? (
                <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                    
                    <div className="relative z-10 p-4 border border-zinc-800 bg-zinc-900/50 rounded-lg backdrop-blur-sm">
                        <SignalIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                        <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest block">Signal Lost</span>
                        <span className="text-zinc-300 text-xs font-bold font-mono mt-1 block">{project.title}</span>
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
                      filter grayscale opacity-80 group-hover:opacity-100 group-hover:filter-none
                      ${isLoading ? 'opacity-0' : 'opacity-100'}
                    `}
                />
            )}

            {/* CRT Scanline Texture Overlay (Static) */}
            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]"></div>

            {/* Sweeping Beam Overlay (Animated) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-[100%] transition-all duration-1000 pointer-events-none z-20"></div>

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
                 <div className="transform scale-90 group-hover:scale-100 transition-transform duration-300">
                     <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                        Access System <ArrowTopRightOnSquareIcon className="ml-2 w-4 h-4" />
                     </span>
                 </div>
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
    </a>
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

      {/* Empty State */}
      {filteredProjects.length === 0 && (
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
