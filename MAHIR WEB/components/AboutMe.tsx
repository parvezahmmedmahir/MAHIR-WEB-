
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import { BoltIcon, CurrencyDollarIcon, CpuChipIcon, CommandLineIcon } from '@heroicons/react/24/outline';

// Using a simple SVG for GitHub to avoid dependency issues
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const AboutMe: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-24">
      
      {/* Section Label */}
      <div className="flex items-center justify-center mb-16">
         <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500"></div>
         <span className="mx-4 text-xs font-mono text-blue-400 tracking-[0.4em] uppercase">Profile Dossier</span>
         <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Personal Stats Card */}
        <div className="lg:col-span-4">
           <div className="relative bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden p-8 shadow-2xl">
              {/* Decorative Header */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              
              <div className="flex flex-col items-center text-center mb-8">
                 {/* Profile Image Container */}
                 <div className="relative w-32 h-32 mb-5 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="relative w-full h-full rounded-full bg-zinc-900 border-4 border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center">
                        {/* 
                           IMPORTANT: 
                           1. Save your photo as 'mahir.jpg'
                           2. Place it in the 'public' folder of your project.
                           If the image is missing, a silhouette icon will appear.
                        */}
                        <img 
                            src="/mahir.jpg" 
                            alt="Mahir Chowdhury" 
                            className={`w-full h-full object-cover transition-opacity duration-300 ${imgError ? 'opacity-0' : 'opacity-100'}`}
                            onError={() => setImgError(true)}
                        />
                        {imgError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800 text-zinc-500">
                                <UserIcon className="w-12 h-12 opacity-20" />
                                <span className="text-[8px] font-mono uppercase mt-1 opacity-40 tracking-widest">No Image</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-zinc-900 rounded-full z-10" title="Online"></div>
                 </div>

                 <h2 className="text-2xl font-bold text-white tracking-tight">Mahir Chowdhury</h2>
                 <a 
                    href="https://t.me/LUX_DOT" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 font-mono mt-1 flex items-center gap-1 transition-colors"
                 >
                    <PaperAirplaneIcon className="w-3 h-3 -rotate-45" />
                    @LUX_DOT
                 </a>
              </div>

              {/* Personal Details Dossier */}
              <div className="space-y-3 font-mono text-xs sm:text-sm border-t border-zinc-800 pt-6">
                 <div className="flex flex-col space-y-1 pb-2 border-b border-zinc-800/50">
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Full Name</span>
                    <span className="text-zinc-200 font-medium truncate" title="Parvez Ahmmed Mahir Chowdhury">Parvez Ahmmed Mahir Chowdhury</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pb-2 border-b border-zinc-800/50">
                     <div className="flex flex-col space-y-1">
                        <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Born</span>
                        <span className="text-zinc-200">14 Oct 2007</span>
                     </div>
                     <div className="flex flex-col space-y-1 text-right">
                        <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Nationality</span>
                        <span className="text-zinc-200">Bangladeshi</span>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pb-2 border-b border-zinc-800/50">
                     <div className="flex flex-col space-y-1">
                        <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Father</span>
                        <span className="text-zinc-200">Monir Ahmmed</span>
                     </div>
                     <div className="flex flex-col space-y-1 text-right">
                        <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Mother</span>
                        <span className="text-zinc-200">Parvin Akhtar</span>
                     </div>
                 </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                 <a href="https://t.me/LUX_DOT" target="_blank" rel="noreferrer" className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                    <PaperAirplaneIcon className="w-4 h-4 mr-2 -rotate-45" />
                    Telegram
                 </a>
                 <div className="grid grid-cols-2 gap-3">
                     <a href="mailto:parvezahmmedmair@gmail.com" className="flex items-center justify-center w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2.5 rounded-lg font-bold text-sm transition-colors border border-zinc-700">
                        <EnvelopeIcon className="w-4 h-4 mr-2" />
                        Email
                     </a>
                     <a href="https://github.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2.5 rounded-lg font-bold text-sm transition-colors border border-zinc-700">
                        <GitHubIcon className="w-4 h-4 mr-2" />
                        GitHub
                     </a>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Biography & Skills */}
        <div className="lg:col-span-8 space-y-10">
            
            {/* Bio Block */}
            <div className="space-y-6">
                <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                    Architecting the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Digital Future</span>.
                </h3>
                <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed text-base md:text-lg">
                    <p>
                        In an era defined by rapid digital transformation, Mahir Chowdhury stands at the vanguard of innovation. A multi-disciplinary technologist and algorithmic strategist, Mahir bridges the complex gap between high-frequency financial markets and sophisticated software architecture.
                    </p>
                    <p>
                        Representing a new generation of self-driven innovators, he specializes in Crypto Trading, Forex Strategies, and Digital Asset Mining, while simultaneously deploying robust web applications and automated tools. His work is not just about writing code; it is about building ecosystems where technology serves financial independence.
                    </p>
                    <p>
                        From designing custom trading indicators to deploying full-stack web applications, Mahir’s vision is clear: to transform abstract ideas into tangible, high-performance digital products.
                    </p>
                </div>
            </div>

            {/* Expertise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-zinc-900/30 border border-zinc-800 hover:border-blue-500/40 rounded-xl transition-all group hover:bg-zinc-900/50">
                    <div className="flex items-center justify-between mb-4">
                        <CurrencyDollarIcon className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono uppercase text-blue-500/50 border border-blue-500/20 px-2 py-1 rounded">Market Analytics</span>
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">Financial Markets</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">Advanced analysis in Crypto & Forex markets, utilizing algorithmic strategies and smart risk management protocols.</p>
                </div>

                <div className="p-6 bg-zinc-900/30 border border-zinc-800 hover:border-purple-500/40 rounded-xl transition-all group hover:bg-zinc-900/50">
                    <div className="flex items-center justify-between mb-4">
                         <CommandLineIcon className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
                         <span className="text-[10px] font-mono uppercase text-purple-500/50 border border-purple-500/20 px-2 py-1 rounded">Development</span>
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">Software Engineering</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">Full-stack development of web apps, automated bots, and digital tools designed for high scalability and performance.</p>
                </div>

                <div className="p-6 bg-zinc-900/30 border border-zinc-800 hover:border-orange-500/40 rounded-xl transition-all group hover:bg-zinc-900/50">
                     <div className="flex items-center justify-between mb-4">
                        <CpuChipIcon className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono uppercase text-orange-500/50 border border-orange-500/20 px-2 py-1 rounded">Infrastructure</span>
                     </div>
                    <h4 className="text-white font-bold text-lg mb-2">Mining & Hardware</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">Deployment and optimization of digital asset mining setups, ensuring maximum hardware efficiency and uptime.</p>
                </div>

                <div className="p-6 bg-zinc-900/30 border border-zinc-800 hover:border-emerald-500/40 rounded-xl transition-all group hover:bg-zinc-900/50">
                    <div className="flex items-center justify-between mb-4">
                         <BoltIcon className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                         <span className="text-[10px] font-mono uppercase text-emerald-500/50 border border-emerald-500/20 px-2 py-1 rounded">Innovation</span>
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">Automated Systems</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">Creating custom indicators and automated scripts to streamline complex workflows and enhance decision making.</p>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};
