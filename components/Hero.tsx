
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { supabase } from '../services/supabase';

export const Hero: React.FC = () => {
  const [headline, setHeadline] = useState("MAHIR WEB");
  const [subheadline, setSubheadline] = useState("The central hub for deployment projects and system architecture.\nBridging the gap between algorithmic trading and modern web solutions.");

  useEffect(() => {
    const fetchHeroData = async () => {
        try {
            const { data } = await supabase.from('profile').select('hero_headline, hero_subheadline').single();
            if (data) {
                if (data.hero_headline) setHeadline(data.hero_headline);
                if (data.hero_subheadline) setSubheadline(data.hero_subheadline);
            }
        } catch (e) {
            // Silent fail to default
        }
    };

    fetchHeroData();
    window.addEventListener('profile-updated', fetchHeroData);
    return () => window.removeEventListener('profile-updated', fetchHeroData);
  }, []);

  // Helper to render title with the last word highlighted
  const renderTitle = (text: string) => {
      const words = text.split(' ');
      if (words.length === 0) return text;
      if (words.length === 1) {
          return <span className="underline decoration-4 decoration-blue-500 underline-offset-4 md:underline-offset-8 text-white">{words[0]}</span>;
      }
      const lastWord = words.pop();
      return (
          <>
            {words.join(' ')}{' '}
            <span className="underline decoration-4 decoration-blue-500 underline-offset-4 md:underline-offset-8 text-white">
                {lastWord}
            </span>
          </>
      );
  };

  return (
    <>
      {/* Hero Text Content */}
      <div className="text-center relative z-10 max-w-6xl mx-auto px-4 pt-8 min-h-[80vh] flex flex-col justify-center">
        <div className="mb-auto"></div> {/* Spacer */}
        
        <div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 leading-[1.1] uppercase">
            {renderTitle(headline)}
          </h1>
          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light mb-8 whitespace-pre-wrap">
            {subheadline}
          </p>
        </div>

        <div className="mt-auto pb-12 flex justify-center">
             <a 
                href="#about-section" 
                className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
                title="Scroll Down"
             >
                <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore</span>
                <ChevronDownIcon className="w-6 h-6 animate-bounce" />
             </a>
        </div>
      </div>
    </>
  );
};
