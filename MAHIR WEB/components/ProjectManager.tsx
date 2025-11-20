
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef } from 'react';
import { XMarkIcon, ClipboardDocumentCheckIcon, GlobeAltIcon, PhotoIcon, TrashIcon, CommandLineIcon, ServerIcon, CodeBracketSquareIcon, ArrowPathIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

// Inline GitHub Icon to ensure availability
const GitHubLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const ProjectManager = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    tags: '',
    customImage: '',
    type: 'WEB',
    status: 'LIVE'
  });

  const [githubUrl, setGithubUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null); // Store scanned data for approval
  
  const [generatedCode, setGeneratedCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
          alert("Image too large. Please use images under 800KB for code generation.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, customImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
      setFormData(prev => ({ ...prev, customImage: '' }));
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  // GITHUB ANALYSIS LOGIC
  const analyzeGithubRepo = async () => {
    if (!githubUrl.includes('github.com')) {
      alert('Please enter a valid GitHub repository URL');
      return;
    }

    setIsAnalyzing(true);
    setScannedData(null); // Reset previous scan

    try {
      // Extract owner and repo from URL
      const regex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = githubUrl.match(regex);

      if (!match) {
        throw new Error("Invalid GitHub URL format");
      }

      const owner = match[1];
      const repo = match[2];

      // 1. Fetch Repo Details
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoRes.ok) throw new Error("Repository not found or private");
      const repoData = await repoRes.json();

      // 2. Fetch Languages
      const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
      const langData = await langRes.json();

      // Process Data for Smart Suggestions
      const languages = Object.keys(langData).slice(0, 3); // Top 3 languages
      const topics = repoData.topics || []; // GitHub Topics
      
      // Smart Tags: Combine Languages and Topics, unique and limited
      const combinedTags = Array.from(new Set([...languages, ...topics])).slice(0, 5).map(t => 
        // Capitalize first letter for consistency
        t.charAt(0).toUpperCase() + t.slice(1)
      );

      // Smart Title Generation
      let smartTitle = repoData.name
        .replace(/[-_]/g, ' ') // Replace separators with spaces
        .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Title Case

      // Refine Title based on description cues if needed (Optional polish)
      if (repoData.description && repoData.description.toLowerCase().includes('bot') && !smartTitle.toLowerCase().includes('bot')) {
         // Only append if not already in title
         // smartTitle += ' Bot'; 
      }

      // Auto-classify Type based on combined signals
      let detectedType = 'WEB';
      const allKeywords = [...languages, ...topics, repoData.name].join(' ').toLowerCase();
      
      if (allKeywords.includes('python') || allKeywords.includes('script') || allKeywords.includes('bot') || allKeywords.includes('automation')) detectedType = 'BOT';
      if (allKeywords.includes('api') || allKeywords.includes('server') || allKeywords.includes('backend')) detectedType = 'API';
      if (allKeywords.includes('data') || allKeywords.includes('analysis') || allKeywords.includes('csv')) detectedType = 'DATA';
      if (allKeywords.includes('react') || allKeywords.includes('vue') || allKeywords.includes('html') || allKeywords.includes('frontend')) detectedType = 'WEB';

      // Store in temporary state for User Approval
      setScannedData({
        title: smartTitle,
        description: repoData.description || "No description provided in repository.",
        link: repoData.html_url,
        tags: combinedTags.join(', '),
        type: detectedType,
        status: 'LIVE'
      });

    } catch (error) {
      console.error(error);
      alert("GitHub Scan Failed: Repository might be private or URL is invalid.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyScannedData = () => {
    if (scannedData) {
      setFormData(prev => ({
        ...prev,
        ...scannedData
      }));
      setScannedData(null); // Clear review state
    }
  };

  const handleGenerate = () => {
    if (!formData.title || !formData.link) {
        alert("Title and Link are required.");
        return;
    }

    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '');
    
    const newProject = {
        id: `sys-${Date.now().toString().slice(-6)}`,
        title: formData.title,
        description: formData.description,
        link: formData.link,
        tags: tagsArray.length > 0 ? tagsArray : ["System"],
        customImage: formData.customImage || undefined,
        type: formData.type,
        status: formData.status
    };

    // 1. Save to Local Storage for IMMEDIATE viewing
    const existingLocal = localStorage.getItem('mahir_local_projects');
    let localProjects = [];
    if (existingLocal) {
        localProjects = JSON.parse(existingLocal);
    }
    localProjects.unshift(newProject);
    localStorage.setItem('mahir_local_projects', JSON.stringify(localProjects));

    // Trigger event to update App
    window.dispatchEvent(new Event('project-updated'));

    // 2. Generate Code String
    const codeString = `  {
    id: '${newProject.id}',
    title: '${newProject.title.replace(/'/g, "\\'")}',
    description: '${newProject.description.replace(/'/g, "\\'")}',
    link: '${newProject.link}',
    tags: ${JSON.stringify(newProject.tags)},
    type: '${newProject.type}',
    status: '${newProject.status}',
    ${newProject.customImage ? `customImage: '${newProject.customImage}'` : '// customImage: undefined'}
  },`;

    setGeneratedCode(codeString);
  };

  const clearLocalStorage = () => {
      if (confirm("Clear all preview projects from your browser view? (This does not affect PERMANENT_PROJECTS in code)")) {
          localStorage.removeItem('mahir_local_projects');
          window.dispatchEvent(new Event('project-updated'));
      }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
  };

  const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '');
  
  let previewImage = 'https://via.placeholder.com/800x600/18181b/3f3f46?text=LINK+REQUIRED';
  if (formData.customImage) {
      previewImage = formData.customImage;
  } else if (formData.link && formData.link.startsWith('http')) {
      previewImage = `https://image.thum.io/get/width/800/crop/600/noanimate/${formData.link}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#09090b] border border-zinc-800 w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Input Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto border-r border-zinc-800 scrollbar-hide">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
                <CommandLineIcon className="w-6 h-6 text-blue-500" />
                SYSTEM DEPLOYMENT MANAGER
              </h2>
              <button onClick={onClose} className="text-zinc-500 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
           </div>

           {/* GitHub Deep Scan Section */}
           <div className="mb-8 bg-zinc-900/50 border border-dashed border-zinc-700 rounded-lg p-4 relative overflow-hidden">
              <label className="flex items-center gap-2 text-[11px] font-mono text-blue-400 uppercase mb-3 font-bold relative z-10">
                <GitHubLogo className="w-4 h-4" />
                GitHub Deep Scan
              </label>
              
              <div className="flex gap-2 relative z-10">
                <input 
                  type="text" 
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="Paste GitHub Repo Link..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none font-mono"
                />
                <button 
                  onClick={analyzeGithubRepo}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <SparklesIcon className="w-4 h-4" />
                  )}
                  {isAnalyzing ? 'Scanning...' : 'Scan'}
                </button>
              </div>

              {/* Scanned Data Approval Card */}
              {scannedData && (
                <div className="mt-4 bg-zinc-950 border border-blue-500/30 rounded p-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Scan Successful</span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">{scannedData.type}</span>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                        <p className="text-zinc-200 font-bold text-sm">{scannedData.title}</p>
                        <p className="text-zinc-500 text-xs truncate">{scannedData.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {scannedData.tags.split(', ').map((t: string) => (
                                <span key={t} className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{t}</span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={applyScannedData}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                        >
                            <CheckCircleIcon className="w-3 h-3" />
                            Accept & Apply
                        </button>
                        <button 
                            onClick={() => setScannedData(null)}
                            className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 py-1.5 rounded text-xs font-bold uppercase transition-colors"
                        >
                            Discard
                        </button>
                    </div>
                </div>
              )}
           </div>

           <div className="space-y-6 border-t border-zinc-800/50 pt-6">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">System Type</label>
                    <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="WEB">Web Application</option>
                        <option value="BOT">Python Bot / Script</option>
                        <option value="API">API Service</option>
                        <option value="DATA">Database / Data</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Current Status</label>
                    <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="LIVE">🟢 Live Online</option>
                        <option value="BETA">🟡 Beta / Testing</option>
                        <option value="DEV">🔵 In Development</option>
                        <option value="OFFLINE">🔴 Offline / Archived</option>
                    </select>
                  </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  placeholder="e.g. High-Frequency Trading Bot V1"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={3}
                  placeholder="Technical overview of the system..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-blue-500 focus:outline-none transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Deployment URL</label>
                <div className="relative">
                    <input 
                    type="text" 
                    name="link" 
                    value={formData.link} 
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-blue-500 focus:outline-none transition-colors pl-10 font-mono text-sm"
                    />
                    <GlobeAltIcon className="w-5 h-5 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Tags / Technologies</label>
                <input 
                  type="text" 
                  name="tags" 
                  value={formData.tags} 
                  onChange={handleChange}
                  placeholder="Python, Automation, Algo"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Visual Interface (Screenshot)</label>
                <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded border border-zinc-800 border-dashed">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-bold transition-colors"
                    >
                        <PhotoIcon className="w-4 h-4" />
                        {formData.customImage ? 'REPLACE IMAGE' : 'UPLOAD IMAGE'}
                    </button>
                    <span className="text-[10px] text-zinc-500 font-mono">
                        {formData.customImage ? 'Image Loaded' : 'Optional: Auto-generates from URL if empty'}
                    </span>
                    {formData.customImage && (
                        <button onClick={removeImage} className="ml-auto text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 flex gap-2">
                  <button 
                    onClick={handleGenerate}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold uppercase tracking-wider text-xs transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  >
                    <CodeBracketSquareIcon className="w-4 h-4" />
                    GENERATE & PREVIEW
                  </button>
              </div>
              
              {/* Clear Preview Button */}
              <div className="mt-4 text-center">
                   <button onClick={clearLocalStorage} className="text-[10px] text-zinc-600 hover:text-red-400 uppercase tracking-widest transition-colors">
                       Clear Local Preview Data
                   </button>
              </div>
           </div>
        </div>

        {/* Right: Live Preview & Code Output */}
        <div className="w-full md:w-1/2 bg-[#050505] flex flex-col border-l border-zinc-800 relative">
            {generatedCode ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                         <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4" /> Project Added to Local Preview
                         </h3>
                         <button 
                            onClick={() => setGeneratedCode('')}
                            className="text-zinc-500 hover:text-white text-xs uppercase"
                         >
                             Create Another
                         </button>
                    </div>
                    <div className="p-6 flex-1 overflow-hidden flex flex-col">
                        <p className="text-zinc-400 text-sm mb-4">
                            To make this permanent, copy the code below and paste it into the <code className="bg-zinc-800 px-1 rounded text-zinc-200">PERMANENT_PROJECTS</code> array in <code className="text-blue-400">App.tsx</code>.
                        </p>
                        <div className="relative flex-1 bg-[#0c0c0e] border border-zinc-800 rounded-lg overflow-hidden group">
                            <div className="absolute top-2 right-2 z-10">
                                <button 
                                    onClick={copyToClipboard}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded transition-colors"
                                    title="Copy Code"
                                >
                                    {copySuccess ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <ClipboardDocumentCheckIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            <textarea 
                                value={generatedCode}
                                readOnly
                                className="w-full h-full bg-transparent p-4 font-mono text-xs text-green-500/90 resize-none focus:outline-none selection:bg-green-500/30"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="absolute top-6 left-6">
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Visual Preview</span>
                    </div>

                    {/* Preview Card */}
                    <div className="w-full max-w-md group relative flex flex-col bg-[#09090b] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                         <div className="h-9 bg-[#0c0c0e] border-b border-zinc-800 flex items-center justify-between px-3">
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-500"><ServerIcon className="w-4 h-4" /></span>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{formData.type}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {formData.status}
                            </span>
                        </div>

                        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                            {(formData.link || formData.customImage) ? (
                                 <img 
                                    src={previewImage}
                                    alt="Preview"
                                    className="absolute inset-0 w-full h-full object-cover object-top opacity-90"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600/000000/333333?text=NO+SIGNAL'; }}
                                 />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 bg-[#0a0a0a]">
                                    <GlobeAltIcon className="w-12 h-12 opacity-20 mb-2" />
                                    <span className="text-[10px] font-mono uppercase">Awaiting Input</span>
                                </div>
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                                 <span className="text-white text-xs font-bold uppercase tracking-wider">Hover Effect Active</span>
                            </div>
                        </div>

                        <div className="p-5 bg-[#09090b] border-t border-zinc-800">
                            <h3 className="text-base font-bold text-zinc-100 mb-2 font-mono">
                                {formData.title || "System Title"}
                            </h3>
                            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
                                {formData.description || "System description..."}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {tagsArray.length > 0 ? tagsArray.map(t => (
                                    <span key={t} className="px-2 py-1 text-[9px] uppercase tracking-wider font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded">
                                        #{t}
                                    </span>
                                )) : <span className="px-2 py-1 text-[9px] uppercase tracking-wider font-medium text-zinc-600 bg-zinc-800 border border-zinc-700 rounded">#TAG</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 text-center">
                <p className="text-[10px] text-zinc-500 font-mono">
                    MAHIR WEB DEPLOYMENT MANAGER V2.1
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
