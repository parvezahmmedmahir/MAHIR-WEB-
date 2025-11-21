
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import { 
  BoltIcon, 
  CurrencyDollarIcon, 
  CpuChipIcon, 
  CommandLineIcon, 
  SparklesIcon,
  ServerIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { supabase, UserProfile, Skill } from '../services/supabase';

// Icon Mapping
const ICON_MAP: Record<string, React.ElementType> = {
    CurrencyDollarIcon,
    CommandLineIcon,
    CpuChipIcon,
    BoltIcon,
    ServerIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
    ChartBarIcon,
    SparklesIcon
};

// GitHub Icon
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const DEFAULT_SKILLS: Skill[] = [
    { title: "Financial Markets", category: "Market Analytics", description: "Advanced analysis in Crypto & Forex markets, utilizing algorithmic strategies and smart risk management protocols.", icon: "CurrencyDollarIcon" },
    { title: "Software Engineering", category: "Development", description: "Full-stack development of web apps, automated bots, and digital tools designed for high scalability and performance.", icon: "CommandLineIcon" },
    { title: "Mining & Hardware", category: "Infrastructure", description: "Deployment and optimization of digital asset mining setups, ensuring maximum hardware efficiency and uptime.", icon: "CpuChipIcon" },
    { title: "Automated Systems", category: "Innovation", description: "Creating custom indicators and automated scripts to streamline complex workflows and enhance decision making.", icon: "BoltIcon" }
];

const DEFAULT_PROFILE: UserProfile = {
    full_name: "Mahir Chowdhury",
    tagline: "Architecting the Digital Future",
    bio: "In an era defined by rapid digital transformation, Mahir Chowdhury stands at the vanguard of innovation. A multi-disciplinary technologist and algorithmic strategist, Mahir bridges the complex gap between high-frequency financial markets and sophisticated software architecture.\n\nRepresenting a new generation of self-driven innovators, he specializes in Crypto Trading, Forex Strategies, and Digital Asset Mining, while simultaneously deploying robust web applications and automated tools.",
    avatar_url: "/mahir.jpg",
    telegram_link: "https://t.me/LUX_DOT",
    github_link: "https://github.com/",
    email: "parvezahmmedmair@gmail.com",
    skills: DEFAULT_SKILLS
};

export const AboutMe: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            // Attempt to fetch from the 'profile' table
            const { data, error } = await supabase
                .from('profile')
                .select('*')
                .limit(1)
                .single();
            
            if (data && !error) {
                setProfile({
                    full_name: data.full_name || DEFAULT_PROFILE.full_name,
                    tagline: data.tagline || DEFAULT_PROFILE.tagline,
                    bio: data.bio || DEFAULT_PROFILE.bio,
                    avatar_url: data.avatar_url || DEFAULT_PROFILE.avatar_url,
                    telegram_link: data.telegram_link || DEFAULT_PROFILE.telegram_link,
                    github_link: data.github_link || DEFAULT_PROFILE.github_link,
                    email: data.email || DEFAULT_PROFILE.email,
                    skills: (data.skills && Array.isArray(data.skills)) ? data.skills : DEFAULT_PROFILE.skills
                });
            }
        } catch (e) {
            console.warn("Using default profile (DB might be empty or table missing):", e);
        } finally {
            setLoading(false);
        }
    };

    fetchProfile();
    // Listen for profile updates
    window.addEventListener('profile-updated', fetchProfile);
    return () => window.removeEventListener('profile-updated', fetchProfile);
  }, []);

  const displaySkills = (profile.skills && profile.skills.length > 0) ? profile.skills : DEFAULT_SKILLS;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-24">
      
      {/* Section Label */}
      <div className="flex items-center justify-center mb-16">
         <div className="flex items-center">
            <div className="h-px w-8 md:w-20 bg-zinc-800 mr-4"></div>
            <span className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                {loading ? <SparklesIcon className="w-3 h-3 animate-spin" /> : "Profile Dossier"}
            </span>
            <div className="h-px w-8 md:w-20 bg-zinc-800 ml-4"></div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Personal Stats Card */}
        <div className="lg:col-span-4">
           <div className="relative bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden p-8 shadow-2xl transition-all duration-500 hover:border-blue-500/30">
              {/* Decorative Header */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              
              <div className="flex flex-col items-center text-center mb-8">
                 {/* Profile Image */}
                 <div className="relative w-32 h-32 mb-5 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="relative w-full h-full rounded-2xl bg-zinc-900 border-4 border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center">
                        <img 
                            src={profile.avatar_url} 
                            alt={profile.full_name} 
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

                 <h2 className="text-2xl font-bold text-white tracking-tight">{profile.full_name}</h2>
                 <a 
                    href={profile.telegram_link}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 font-mono mt-1 flex items-center gap-1 transition-colors"
                 >
                    <PaperAirplaneIcon className="w-3 h-3 -rotate-45" />
                    {profile.telegram_link.split('/').pop() || 'CONTACT'}
                 </a>
              </div>

              {/* Personal Details Dossier */}
              <div className="space-y-3 font-mono text-xs sm:text-sm border-t border-zinc-800 pt-6">
                 <div className="flex flex-col space-y-1 pb-2 border-b border-zinc-800/50">
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Role</span>
                    <span className="text-zinc-200 font-medium truncate">Full Stack Engineer & Trader</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pb-2 border-b border-zinc-800/50">
                     <div className="flex flex-col space-y-1">
                        <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Status</span>
                        <span className="text-emerald-400 font-bold animate-pulse">ACTIVE</span>
                     </div>
                     <div className="flex flex-col space-y-1 text-right">
                        <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Nationality</span>
                        <span className="text-zinc-200">Bangladeshi</span>
                     </div>
                 </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                 <a href={profile.telegram_link} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                    <PaperAirplaneIcon className="w-4 h-4 mr-2 -rotate-45" />
                    Telegram
                 </a>
                 <div className="grid grid-cols-2 gap-3">
                     <a href={`mailto:${profile.email}`} className="flex items-center justify-center w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2.5 rounded-lg font-bold text-sm transition-colors border border-zinc-700">
                        <EnvelopeIcon className="w-4 h-4 mr-2" />
                        Email
                     </a>
                     <a href={profile.github_link} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2.5 rounded-lg font-bold text-sm transition-colors border border-zinc-700">
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8">
                <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{profile.tagline}</span>
                </h3>
                <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                    {profile.bio}
                </div>
            </div>

            {/* Expertise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displaySkills.map((skill, index) => {
                    const IconComponent = ICON_MAP[skill.icon] || SparklesIcon;
                    const colors = [
                        'text-blue-500 border-blue-500/20',
                        'text-purple-500 border-purple-500/20',
                        'text-orange-500 border-orange-500/20',
                        'text-emerald-500 border-emerald-500/20',
                        'text-red-500 border-red-500/20',
                        'text-cyan-500 border-cyan-500/20'
                    ];
                    const colorClass = colors[index % colors.length];
                    const textClass = colorClass.split(' ')[0];

                    return (
                        <div key={index} className="p-6 bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 rounded-xl transition-all group hover:bg-zinc-900/50">
                            <div className="flex items-center justify-between mb-4">
                                <IconComponent className={`w-8 h-8 ${textClass} group-hover:scale-110 transition-transform`} />
                                <span className={`text-[10px] font-mono uppercase px-2 py-1 rounded ${colorClass.replace('text-', 'text-').replace('border-', 'bg-').replace('/20', '/5')} border ${colorClass.split(' ')[1]}`}>
                                    {skill.category}
                                </span>
                            </div>
                            <h4 className="text-white font-bold text-lg mb-2">{skill.title}</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">{skill.description}</p>
                        </div>
                    );
                })}
            </div>

        </div>
      </div>
    </section>
  );
};
