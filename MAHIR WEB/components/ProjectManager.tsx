/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from 'react';
import { 
  XMarkIcon, 
  CloudArrowUpIcon,
  GlobeAltIcon, 
  PhotoIcon, 
  TrashIcon, 
  CommandLineIcon, 
  ServerIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  SparklesIcon,
  LockClosedIcon,
  UserIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../services/supabase';

// Inline GitHub Icon
const GitHubLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const ProjectManager = ({ onClose }: { onClose: () => void }) => {
  // ==========================================
  // 1. STATE DEFINITIONS
  // ==========================================
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    tags: '',
    customImage: '',
    type: 'WEB',
    status: 'LIVE'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // 2. AUTHENTICATION LOGIC
  // ==========================================
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setLoginError('');
    
    if (isSignUp) {
        // CREATE NEW ACCOUNT
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            setLoginError(error.message);
        } else {
            alert("Account created! You are automatically logged in.");
            // Sometimes Supabase requires email confirmation. If so, alert user.
        }
    } else {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setLoginError(error.message);
        }
    }
    setAuthLoading(false);
  };

  // ==========================================
  // 3. FORM HANDLERS
  // ==========================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, customImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
      setFormData(prev => ({ ...prev, customImage: '' }));
      setSelectedFile(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  // --- GITHUB ANALYSIS ---
  const analyzeGithubRepo = async () => {
    if (!githubUrl.includes('github.com')) {
      alert('Please enter a valid GitHub repository URL');
      return;
    }
    setIsAnalyzing(true);
    setScannedData(null);

    try {
      const regex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = githubUrl.match(regex);
      if (!match) throw new Error("Invalid GitHub URL format");

      const owner = match[1];
      const repo = match[2];

      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoRes.ok) throw new Error("Repository not found or private");
      const repoData = await repoRes.json();

      let languages: string[] = [];
      try {
        const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
        const langData = await langRes.json();
        languages = Object.keys(langData).slice(0, 3);
      } catch (e) { console.warn("Could not fetch languages", e); }

      const topics = repoData.topics || [];
      const combinedTags = Array.from(new Set([...languages, ...topics])).slice(0, 5).map(t => 
        t.charAt(0).toUpperCase() + t.slice(1)
      );

      let smartTitle = repoData.name
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());

      let detectedType = 'WEB';
      const allKeywords = [...languages, ...topics, repoData.name].join(' ').toLowerCase();
      if (allKeywords.includes('python') || allKeywords.includes('bot')) detectedType = 'BOT';
      else if (allKeywords.includes('api')) detectedType = 'API';
      else if (allKeywords.includes('data')) detectedType = 'DATA';

      setScannedData({
        title: smartTitle,
        description: repoData.description || "No description provided.",
        link: repoData.html_url,
        tags: combinedTags.join(', '),
        type: detectedType,
        status: 'LIVE'
      });

    } catch (error) {
      alert("GitHub Scan Failed. Check URL.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyScannedData = () => {
    if (scannedData) {
      setFormData(prev => ({ ...prev, ...scannedData }));
      setScannedData(null);
    }
  };

  // --- PUBLISH TO SUPABASE ---
  const handlePublish = async () => {
    if (!formData.title || !formData.link) {
        alert("Title and Link are required.");
        return;
    }
    setIsPublishing(true);

    try {
        let imageUrl = '';
        
        // 1. Upload Image to Supabase Storage if file selected
        if (selectedFile) {
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(filePath, selectedFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('project-images')
                .getPublicUrl(filePath);
                
            imageUrl = publicUrl;
        } else if (formData.customImage && formData.customImage.startsWith('data:')) {
            // Skip base64 if not file
        }

        // 2. Insert into Database
        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '');

        const { error: insertError } = await supabase
            .from('projects')
            .insert([
                {
                    title: formData.title,
                    description: formData.description,
                    link: formData.link,
                    tags: tagsArray,
                    customImage: imageUrl || null,
                    type: formData.type,
                    status: formData.status,
                    user_id: session.user.id
                }
            ]);

        if (insertError) throw insertError;

        setPublishSuccess(true);
        // Trigger refresh in App
        window.dispatchEvent(new Event('project-updated'));
        setTimeout(() => setPublishSuccess(false), 3000);
        // Reset form
        setFormData({
            title: '', description: '', link: '', tags: '', customImage: '', type: 'WEB', status: 'LIVE'
        });
        setSelectedFile(null);

    } catch (error: any) {
        console.error(error);
        if (error.message?.includes('relation "projects" does not exist')) {
             alert("DATABASE ERROR: The 'projects' table does not exist. You must run the SQL script in your Supabase Dashboard.");
        } else {
             alert(`Publish Failed: ${error.message || error}`);
        }
    } finally {
        setIsPublishing(false);
    }
  };

  // ==========================================
  // 4. RENDER
  // ==========================================
  
  // --- LOGIN VIEW ---
  if (!session) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#09090b] border border-zinc-800 w-full max-w-md p-8 rounded-xl shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800 text-blue-500">
                        {isSignUp ? <UserPlusIcon className="w-6 h-6" /> : <LockClosedIcon className="w-6 h-6" />}
                    </div>
                    <h2 className="text-xl font-bold text-white font-mono">
                        {isSignUp ? 'CREATE ADMIN ACCOUNT' : 'SYSTEM ACCESS'}
                    </h2>
                    <p className="text-zinc-500 text-xs mt-2">
                        {isSignUp ? 'Register new system administrator' : 'Secure Admin Terminal'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Admin Email</label>
                        <div className="relative">
                            <UserIcon className="w-5 h-5 text-zinc-600 absolute left-3 top-2.5" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 pl-10 text-white focus:border-blue-500 focus:outline-none text-sm font-mono"
                                placeholder="admin@mahirweb.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Passkey</label>
                        <div className="relative">
                            <LockClosedIcon className="w-5 h-5 text-zinc-600 absolute left-3 top-2.5" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 pl-10 text-white focus:border-blue-500 focus:outline-none text-sm font-mono"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {loginError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs font-mono">
                            Error: {loginError}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={authLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center"
                    >
                        {authLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" /> : (isSignUp ? 'CREATE ACCOUNT' : 'AUTHENTICATE')}
                    </button>

                    <div className="text-center pt-2">
                        <button 
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-xs text-zinc-500 hover:text-blue-400 underline"
                        >
                            {isSignUp ? 'Already have an account? Login' : 'No account? Create one'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      );
  }

  // --- ADMIN VIEW ---
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
                <CommandLineIcon className="w-6 h-6 text-emerald-500" />
                DATABASE MANAGER
              </h2>
              <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">LOGGED IN</span>
                  <button onClick={onClose} className="text-zinc-500 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
              </div>
           </div>

           {/* GitHub Deep Scan */}
           <div className="mb-8 bg-zinc-900/50 border border-dashed border-zinc-700 rounded-lg p-4 relative overflow-hidden">
              <label className="flex items-center gap-2 text-[11px] font-mono text-blue-400 uppercase mb-3 font-bold relative z-10">
                <GitHubLogo className="w-4 h-4" />
                GitHub Auto-Import
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
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4" />}
                  {isAnalyzing ? 'Scanning...' : 'Scan'}
                </button>
              </div>

              {scannedData && (
                <div className="mt-4 bg-zinc-950 border border-blue-500/30 rounded p-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Found Data</span>
                    </div>
                    <p className="text-zinc-200 font-bold text-sm">{scannedData.title}</p>
                    <div className="flex gap-2 mt-3">
                        <button onClick={applyScannedData} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                            <CheckCircleIcon className="w-3 h-3" /> Apply
                        </button>
                        <button onClick={() => setScannedData(null)} className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 py-1.5 rounded text-xs font-bold uppercase">Discard</button>
                    </div>
                </div>
              )}
           </div>

           <div className="space-y-6 border-t border-zinc-800/50 pt-6">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-white text-sm focus:border-blue-500 focus:outline-none">
                        <option value="WEB">Web App</option>
                        <option value="BOT">Bot / Script</option>
                        <option value="API">API / Backend</option>
                        <option value="DATA">Data / Infra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2.5 text-white text-sm focus:border-blue-500 focus:outline-none">
                        <option value="LIVE">🟢 Live</option>
                        <option value="BETA">🟡 Beta</option>
                        <option value="DEV">🔵 In Dev</option>
                        <option value="OFFLINE">🔴 Offline</option>
                    </select>
                  </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-blue-500 focus:outline-none font-mono text-sm" />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-blue-500 focus:outline-none text-sm" />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Link</label>
                <div className="relative">
                    <input type="text" name="link" value={formData.link} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-blue-500 focus:outline-none pl-10 font-mono text-sm" />
                    <GlobeAltIcon className="w-5 h-5 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Tags</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-blue-500 focus:outline-none font-mono text-sm" />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Cover Image (Supabase Storage)</label>
                <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded border border-zinc-800 border-dashed">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-bold transition-colors">
                        <PhotoIcon className="w-4 h-4" />
                        {selectedFile ? 'CHANGE FILE' : 'UPLOAD FILE'}
                    </button>
                    <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">
                        {selectedFile ? selectedFile.name : (formData.customImage ? 'Image Set' : 'Optional: Auto-screenshot')}
                    </span>
                    {(selectedFile || formData.customImage) && (
                        <button onClick={removeImage} className="ml-auto text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
              </div>

              <div className="mt-8">
                  <button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold uppercase tracking-wider text-sm transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50"
                  >
                    {isPublishing ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <CloudArrowUpIcon className="w-5 h-5" />}
                    {isPublishing ? 'PUBLISHING TO CLOUD...' : 'PUBLISH PROJECT'}
                  </button>
                  {publishSuccess && (
                      <p className="text-center text-emerald-500 font-mono text-xs mt-2 animate-pulse">SUCCESSFULLY DEPLOYED TO DATABASE</p>
                  )}
              </div>
           </div>
        </div>

        {/* Right: Preview */}
        <div className="w-full md:w-1/2 bg-[#050505] flex flex-col border-l border-zinc-800 relative p-8 items-center justify-center">
            <div className="absolute top-6 left-6">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Visual Preview</span>
            </div>
            
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
                </div>

                <div className="p-5 bg-[#09090b] border-t border-zinc-800">
                    <h3 className="text-base font-bold text-zinc-100 mb-2 font-mono">{formData.title || "System Title"}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{formData.description || "System description..."}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {tagsArray.map(t => (
                            <span key={t} className="px-2 py-1 text-[9px] uppercase tracking-wider font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded">#{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
