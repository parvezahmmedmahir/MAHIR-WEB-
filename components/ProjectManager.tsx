
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  XMarkIcon, 
  CloudArrowUpIcon,
  PhotoIcon, 
  TrashIcon, 
  CommandLineIcon, 
  ArrowPathIcon, 
  SparklesIcon,
  ShieldCheckIcon,
  ListBulletIcon,
  IdentificationIcon,
  PlusCircleIcon,
  CpuChipIcon,
  GlobeAmericasIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { supabase, checkConnection, UserProfile, Skill } from '../services/supabase';
import { generateSmartDescription } from '../services/gemini';

const ICON_OPTIONS = [
  { label: 'Finance ($)', value: 'CurrencyDollarIcon' },
  { label: 'Code (Terminal)', value: 'CommandLineIcon' },
  { label: 'Hardware (Chip)', value: 'CpuChipIcon' },
  { label: 'Power (Bolt)', value: 'BoltIcon' },
  { label: 'Server', value: 'ServerIcon' },
  { label: 'Security', value: 'ShieldCheckIcon' },
  { label: 'Global', value: 'GlobeAltIcon' },
  { label: 'Stats (Chart)', value: 'ChartBarIcon' },
];

export const ProjectManager = ({ onClose }: { onClose: () => void }) => {
  // ==========================================
  // 1. STATE DEFINITIONS
  // ==========================================
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [securityStatus, setSecurityStatus] = useState<'CHECKING' | 'SECURE' | 'RISK'>('CHECKING');
  const [securityDetails, setSecurityDetails] = useState<string>('Checking connection protocols...');
  
  // Pre-filled for convenience (Updated based on user context)
  const [email, setEmail] = useState('parvezahmmedmahir@gmail.com');
  const [password, setPassword] = useState('MAHIR08148404');
  const [loginError, setLoginError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Manager View States
  const [activeTab, setActiveTab] = useState<'DEPLOY' | 'MANAGE' | 'PROFILE'>('DEPLOY');
  const [existingProjects, setExistingProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Notification State
  const [notification, setNotification] = useState<{type: 'SUCCESS' | 'ERROR', message: string} | null>(null);

  // Project Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    tags: '',
    customImage: '',
    type: 'WEB',
    status: 'LIVE'
  });

  // Profile Form Data
  const [profileData, setProfileData] = useState<UserProfile>({
    full_name: '',
    tagline: '',
    bio: '',
    avatar_url: '',
    telegram_link: '',
    github_link: '',
    email: '',
    skills: [],
    hero_headline: 'MAHIR WEB',
    hero_subheadline: '',
    show_preloaded: true
  });

  // New Skill State
  const [newSkill, setNewSkill] = useState<Skill>({
      title: '',
      category: '',
      description: '',
      icon: 'SparklesIcon'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Detect Demo Mode
  const isDemoMode = useMemo(() => {
      const url = (supabase as any).supabaseUrl || '';
      return url.includes('dsrufuqpdwonwxxwmcgd');
  }, []);

  // Helper to show notification
  const showNotification = (type: 'SUCCESS' | 'ERROR', message: string) => {
    setNotification({ type, message });
    // Auto-dismiss after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  // ==========================================
  // 2. AUTHENTICATION & INITIALIZATION
  // ==========================================
  useEffect(() => {
    let mounted = true;
    
    const initSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (mounted) {
                setSession(session);
                if (session) {
                    fetchExistingProjects();
                    performSecurityCheck();
                    fetchProfileData();
                }
                setAuthLoading(false);
            }
        } catch (e) {
            console.warn("Auth check warning:", e);
            if (mounted) setAuthLoading(false);
        }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
          setSession(session);
          if (session) {
              fetchExistingProjects();
              performSecurityCheck();
              fetchProfileData();
          }
      }
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, []);

  const performSecurityCheck = async () => {
    setSecurityStatus('CHECKING');
    setSecurityDetails('Pinging database...');
    const isConnected = await checkConnection();
    if (isConnected) {
        setSecurityStatus('SECURE');
        setSecurityDetails('Connection Valid • RLS Enabled • SSL Active');
    } else {
        setSecurityStatus('RISK');
        setSecurityDetails('Database unreachable or tables missing. Run SQL Setup.');
    }
  };

  const fetchExistingProjects = async () => {
      setLoadingProjects(true);
      try {
          const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
          if (!error && data) {
              setExistingProjects(data);
          }
      } catch (e) {
          console.warn("Fetch existing projects error:", e);
      } finally {
          setLoadingProjects(false);
      }
  };

  const fetchProfileData = async () => {
      try {
          const { data } = await supabase.from('profile').select('*').single();
          if (data) {
              setProfileData({
                  id: data.id,
                  full_name: data.full_name || '',
                  tagline: data.tagline || '',
                  bio: data.bio || '',
                  avatar_url: data.avatar_url || '',
                  telegram_link: data.telegram_link || '',
                  github_link: data.github_link || '',
                  email: data.email || '',
                  skills: Array.isArray(data.skills) ? data.skills : [],
                  hero_headline: data.hero_headline || 'MAHIR WEB',
                  hero_subheadline: data.hero_subheadline || '',
                  show_preloaded: data.show_preloaded !== false // Default true
              });
          }
      } catch (e) {
          console.warn("Profile fetch error (maybe table doesn't exist yet):", e);
      }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setLoginError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();

    try {
        if (isForgotPassword) {
            const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo: window.location.origin });
            if (error) throw error;
            setSuccessMsg(`Recovery email sent to ${cleanEmail}.`);
            setTimeout(() => setIsForgotPassword(false), 5000);
        } else if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password });
            if (error) throw error;
            if (data.session) setSuccessMsg("Account created and logged in!");
            else setSuccessMsg("Account created! Verify email.");
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
            if (error) throw error;
        }
    } catch (error: any) {
        console.error("Auth Error:", error);
        let msg = error.message || "Authentication failed";
        // User-friendly mapping
        if (msg.includes("Invalid login credentials")) msg = "Incorrect email or password. Please try again.";
        if (msg.includes("Email not confirmed")) msg = "Please verify your email address before logging in.";
        setLoginError(msg);
    } finally {
        setAuthLoading(false);
    }
  };

  // ==========================================
  // 3. FORM HANDLERS & CRUD
  // ==========================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- SKILLS HANDLERS ---
  const handleNewSkillChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setNewSkill(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addSkill = () => {
      if (!newSkill.title || !newSkill.category) return showNotification('ERROR', "Title and Category are required.");
      setProfileData(prev => ({
          ...prev,
          skills: [...(prev.skills || []), newSkill]
      }));
      setNewSkill({ title: '', category: '', description: '', icon: 'SparklesIcon' });
  };

  const removeSkill = (index: number) => {
      setProfileData(prev => ({
          ...prev,
          skills: (prev.skills || []).filter((_, i) => i !== index)
      }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'PROJECT' | 'AVATAR') => {
    const file = e.target.files?.[0];
    if (file) {
      // VALIDATION
      if (!file.type.startsWith('image/')) {
          showNotification('ERROR', 'Invalid file format. Please upload an image (JPG, PNG, WEBP).');
          return;
      }
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
          showNotification('ERROR', 'File size too large. Maximum allowed is 4MB.');
          return;
      }

      if (type === 'PROJECT') {
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onloadend = () => setFormData(prev => ({ ...prev, customImage: reader.result as string }));
          reader.readAsDataURL(file);
      } else {
          setSelectedAvatar(file);
          const reader = new FileReader();
          reader.onloadend = () => setProfileData(prev => ({ ...prev, avatar_url: reader.result as string }));
          reader.readAsDataURL(file);
      }
    }
  };

  const editProject = (project: any) => {
      setEditingId(project.id);
      setFormData({
          title: project.title,
          description: project.description,
          link: project.link,
          tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
          customImage: project.customImage || '',
          type: project.type || 'WEB',
          status: project.status || 'LIVE'
      });
      setActiveTab('DEPLOY');
      showNotification('SUCCESS', `Editing "${project.title}".`);
  };

  const deleteProject = async (id: string) => {
      if (!confirm("CONFIRM DELETION? This action cannot be undone.")) return;
      setDeletingId(id);
      try {
          await supabase.from('projects').delete().eq('id', id);
          await fetchExistingProjects();
          window.dispatchEvent(new Event('project-updated'));
          showNotification('SUCCESS', "Project deleted successfully.");
      } catch (error: any) {
          showNotification('ERROR', "Deletion failed: " + error.message);
      } finally {
          setDeletingId(null);
      }
  };

  // --- REPO ANALYSIS (AI POWERED) ---
  const analyzeRepo = async () => {
    const url = repoUrl.toLowerCase().trim();
    if (!url) return showNotification('ERROR', "Please enter a valid GitHub or Bitbucket URL.");
    setIsAnalyzing(true);
    try {
        let repoName = url.split('/').pop()?.replace('.git', '') || 'Project';
        let desc = "Auto-imported project.";
        let topics: string[] = [];
        let languages: string[] = [];
        let readmeText = '';

        // 1. GitHub Logic
        if (url.includes('github.com')) {
             try {
                const parts = url.split('github.com/')[1].split('/');
                if (parts.length >= 2) {
                    // 1. Fetch General Repo Info
                    const apiRes = await fetch(`https://api.github.com/repos/${parts[0]}/${parts[1]}`);
                    if (apiRes.ok) {
                        const data = await apiRes.json();
                        repoName = data.name;
                        desc = data.description || desc;
                        topics = data.topics || [];
                    }

                    // 2. Fetch README (New for better context)
                    const readmeRes = await fetch(`https://api.github.com/repos/${parts[0]}/${parts[1]}/readme`);
                    if (readmeRes.ok) {
                        const readmeData = await readmeRes.json();
                        if (readmeData.content) {
                             // GitHub API returns content in Base64 with newlines. Remove whitespace before decode.
                             readmeText = atob(readmeData.content.replace(/\s/g, ''));
                        }
                    }
                }
             } catch (e) { console.warn("GitHub API fetch failed, utilizing purely generative analysis."); }
        } 
        // 2. Bitbucket Logic
        else if (url.includes('bitbucket.org')) {
             try {
                // Expected format: https://bitbucket.org/workspace/repo_slug
                const parts = url.split('bitbucket.org/')[1].split('/').filter(Boolean);
                if (parts.length >= 2) {
                    const workspace = parts[0];
                    const repoSlug = parts[1].replace(/\.git$/, ''); // Remove .git suffix if present

                    // Fetch Repo Details
                    const apiRes = await fetch(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}`);
                    if (apiRes.ok) {
                        const data = await apiRes.json();
                        repoName = data.name;
                        desc = data.description || desc;
                        
                        // Try to fetch README
                        const mainBranch = data.mainbranch?.name || 'master';
                        // Attempt to fetch raw README content via API src endpoint
                        try {
                            const readmeRes = await fetch(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/src/${mainBranch}/README.md`);
                            if (readmeRes.ok) {
                                // Bitbucket sometimes returns JSON metadata for the file, or the raw content depending on headers/context
                                const text = await readmeRes.text();
                                // Simple check to ensure we didn't get the JSON metadata response
                                if (!text.includes('"type": "commit_file"')) {
                                    readmeText = text;
                                }
                            }
                        } catch (e) {
                            console.warn("Bitbucket README fetch warning:", e);
                        }
                    }
                }
             } catch (e) { console.warn("Bitbucket API fetch failed, utilizing purely generative analysis.", e); }
        }

        // AI ENHANCEMENT with Version Logic
        const smartDesc = await generateSmartDescription(repoName, desc, languages, topics, readmeText);
        
        setScannedData({
            title: repoName.toUpperCase().replace(/-/g, ' '),
            description: smartDesc,
            link: url,
            tags: topics.slice(0,4).join(', ').toUpperCase() || 'AI, AUTOMATION',
            type: 'WEB',
            status: 'LIVE'
        });
        showNotification('SUCCESS', "Analysis Complete. Review data below.");
    } catch (e: any) {
        showNotification('ERROR', "Analysis Failed: " + e.message);
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

  // --- SAVE PROJECT ---
  const handlePublish = async () => {
    if (!formData.title) return showNotification('ERROR', "Project title is required.");
    
    setIsPublishing(true);
    try {
        let imageUrl = formData.customImage;
        
        // 1. Check if User Uploaded a Manual File
        if (selectedFile) {
            const fileName = `project-${Date.now()}`;
            const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, selectedFile);
            if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
            
            const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
            imageUrl = data.publicUrl;
        } 
        // 2. If no custom image, but we have a link, generate a thumbnail via Thum.io and Upload to Supabase
        else if (!imageUrl && formData.link && formData.type !== 'SOCIAL') {
             // We use wait/4 to allow time for the site to load before capturing
             const thumUrl = `https://image.thum.io/get/width/1200/crop/800/allowJPG/wait/4/noanimate/${formData.link}`;
             
             try {
                const response = await fetch(thumUrl);
                if (response.ok) {
                    const blob = await response.blob();
                    const fileName = `auto-gen-${Date.now()}.jpg`;
                    
                    // Upload generated blob to Supabase
                    const { error: uploadError } = await supabase.storage
                        .from('project-images')
                        .upload(fileName, blob, {
                            contentType: 'image/jpeg',
                            upsert: true
                        });

                    if (!uploadError) {
                        const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
                        imageUrl = data.publicUrl;
                    } else {
                        console.warn("Auto-upload to Supabase failed, falling back to direct link.", uploadError);
                        imageUrl = thumUrl;
                    }
                } else {
                    imageUrl = thumUrl;
                }
             } catch (err) {
                 imageUrl = thumUrl;
             }
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            link: formData.link,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            customImage: imageUrl,
            type: formData.type,
            status: formData.status,
            user_id: session.user.id
        };

        if (editingId) await supabase.from('projects').update(payload).eq('id', editingId);
        else await supabase.from('projects').insert([payload]);

        setPublishSuccess(true);
        window.dispatchEvent(new Event('project-updated'));
        setFormData({ title: '', description: '', link: '', tags: '', customImage: '', type: 'WEB', status: 'LIVE' });
        setEditingId(null);
        setSelectedFile(null);
        fetchExistingProjects();
        showNotification('SUCCESS', editingId ? "System updated successfully." : "Project deployed successfully.");
        setTimeout(() => setPublishSuccess(false), 3000);
    } catch (error: any) {
        console.error("Publish Error:", error);
        let msg = error.message;
        if (msg.includes("row-level security")) msg = "Access Denied. You do not have permission to modify database records.";
        showNotification('ERROR', "Deployment Failed: " + msg);
    } finally {
        setIsPublishing(false);
    }
  };

  // --- SAVE PROFILE ---
  const handleSaveProfile = async () => {
      setIsPublishing(true);
      try {
          let avatarUrl = profileData.avatar_url;
          if (selectedAvatar) {
              const fileName = `avatar-${Date.now()}`;
              const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, selectedAvatar);
              if (uploadError) throw new Error(`Avatar upload failed: ${uploadError.message}`);

              const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
              avatarUrl = data.publicUrl;
          }

          const payload = {
              ...profileData,
              avatar_url: avatarUrl
          };

          // Update or Insert (Upsert)
          if (profileData.id) {
              await supabase.from('profile').update(payload).eq('id', profileData.id);
          } else {
              const { data } = await supabase.from('profile').select('id').single();
              if (data) {
                  await supabase.from('profile').update(payload).eq('id', data.id);
              } else {
                  await supabase.from('profile').insert([payload]);
              }
          }

          setPublishSuccess(true);
          window.dispatchEvent(new Event('profile-updated'));
          fetchProfileData();
          showNotification('SUCCESS', "Profile configuration saved.");
          setTimeout(() => setPublishSuccess(false), 3000);
      } catch (e: any) {
          console.error("Profile Save Error:", e);
          let msg = e.message;
          if (msg.includes("row-level security")) msg = "Access Denied. Run SQL Setup in Supabase.";
          showNotification('ERROR', "Profile Update Failed: " + msg);
      } finally {
          setIsPublishing(false);
      }
  };

  // ==========================================
  // 4. RENDER
  // ==========================================
  if (!session) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#09090b] border border-zinc-800 w-full max-w-md p-8 rounded-xl shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-blue-500">
                         <ShieldCheckIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-white font-mono">SECURE CONTROL CENTER</h2>
                    <p className="text-xs text-zinc-500 mt-2">RESTRICTED ACCESS</p>
                </div>
                <form onSubmit={handleAuth} className="space-y-4">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-white text-sm font-mono" placeholder="Admin ID" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-white text-sm font-mono" placeholder="Passkey" />
                    {loginError && <p className="text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/20">{loginError}</p>}
                    <button type="submit" disabled={authLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded font-bold text-xs uppercase tracking-widest transition-colors">
                        {authLoading ? 'Verifying Credentials...' : 'Authenticate'}
                    </button>
                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#09090b] border border-zinc-800 w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT: CONTROLS */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto border-r border-zinc-800 scrollbar-hide">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
                <CommandLineIcon className="w-6 h-6 text-emerald-500" />
                CONTROL CENTER
              </h2>
              <button onClick={onClose} className="text-zinc-500 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
           </div>

           {/* Security Status Bar */}
           <div className={`mb-6 p-3 rounded border flex flex-col gap-1 text-xs font-mono ${securityStatus === 'SECURE' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
               <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${securityStatus === 'SECURE' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                       <span className={securityStatus === 'SECURE' ? 'text-emerald-400' : 'text-red-400'}>{securityStatus === 'SECURE' ? 'SYSTEM SECURE' : 'SECURITY ALERT'}</span>
                   </div>
                   <span className="opacity-50">{session.user.email}</span>
               </div>
               <p className="text-zinc-500 pl-4">{securityDetails}</p>
           </div>

           {/* Notification Banner */}
           {notification && (
               <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${notification.type === 'SUCCESS' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                   {notification.type === 'SUCCESS' ? <CheckCircleIcon className="w-5 h-5 shrink-0" /> : <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />}
                   <div className="text-sm font-mono">
                       <p className="font-bold">{notification.type === 'SUCCESS' ? 'SUCCESS' : 'SYSTEM ERROR'}</p>
                       <p className="opacity-80 text-xs mt-1">{notification.message}</p>
                   </div>
                   <button onClick={() => setNotification(null)} className="ml-auto hover:text-white"><XMarkIcon className="w-4 h-4" /></button>
               </div>
           )}

           {/* Tabs */}
           <div className="flex gap-2 mb-8 border-b border-zinc-800/50 pb-1">
               <button onClick={() => setActiveTab('DEPLOY')} className={`px-4 py-2 text-[10px] uppercase font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'DEPLOY' ? 'text-blue-400 border-blue-400' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>
                   <CloudArrowUpIcon className="w-4 h-4" /> Deploy
               </button>
               <button onClick={() => setActiveTab('MANAGE')} className={`px-4 py-2 text-[10px] uppercase font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'MANAGE' ? 'text-emerald-400 border-emerald-400' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>
                   <ListBulletIcon className="w-4 h-4" /> Projects
               </button>
               <button onClick={() => setActiveTab('PROFILE')} className={`px-4 py-2 text-[10px] uppercase font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'PROFILE' ? 'text-purple-400 border-purple-400' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>
                   <IdentificationIcon className="w-4 h-4" /> Profile
               </button>
           </div>

           {/* === PROFILE TAB === */}
           {activeTab === 'PROFILE' && (
               <div className="animate-in fade-in space-y-6">
                   {/* SITE IDENTITY SECTION */}
                   <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/30">
                       <label className="block text-[10px] font-mono text-blue-400 font-bold uppercase mb-4 flex items-center gap-2">
                           <GlobeAmericasIcon className="w-4 h-4" /> Site Identity & Settings
                       </label>
                       <div className="grid grid-cols-1 gap-4 mb-4">
                            <div>
                                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Hero Headline (Last word highlighted)</label>
                                <input name="hero_headline" value={profileData.hero_headline} onChange={handleProfileChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-blue-500 transition-colors outline-none" placeholder="MAHIR WEB" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Hero Subheadline</label>
                                <textarea name="hero_subheadline" value={profileData.hero_subheadline} onChange={handleProfileChange} rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-blue-500 transition-colors outline-none" placeholder="Short intro text..." />
                            </div>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded">
                            <div className="flex items-center gap-2">
                                {profileData.show_preloaded ? <EyeIcon className="w-4 h-4 text-emerald-500" /> : <EyeSlashIcon className="w-4 h-4 text-zinc-500" />}
                                <span className="text-xs text-zinc-300 font-mono">Show Default Projects</span>
                            </div>
                            <button 
                                onClick={() => setProfileData(prev => ({ ...prev, show_preloaded: !prev.show_preloaded }))}
                                className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${profileData.show_preloaded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}
                            >
                                {profileData.show_preloaded ? 'VISIBLE' : 'HIDDEN'}
                            </button>
                       </div>
                   </div>

                   {/* Profile Header Edit */}
                   <div className="flex items-center gap-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                       <div className="w-20 h-20 rounded-full bg-zinc-950 overflow-hidden border-2 border-zinc-700 group relative">
                           <img src={profileData.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <PhotoIcon className="w-6 h-6 text-white" />
                           </div>
                       </div>
                       <div className="flex-1">
                           <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Update Avatar</label>
                           <div className="flex items-center gap-2">
                               <button onClick={() => avatarInputRef.current?.click()} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-white border border-zinc-700 transition-colors">Choose File</button>
                               <input type="file" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'AVATAR')} className="hidden" />
                           </div>
                       </div>
                   </div>
                   
                   {/* Main Fields */}
                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Full Name</label>
                            <input name="full_name" value={profileData.full_name} onChange={handleProfileChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-purple-500 transition-colors outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Tagline</label>
                            <input name="tagline" value={profileData.tagline} onChange={handleProfileChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-purple-500 transition-colors outline-none" />
                        </div>
                   </div>
                   <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Bio (Markdown Supported)</label>
                        <textarea name="bio" value={profileData.bio} onChange={handleProfileChange} rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-purple-500 transition-colors outline-none" />
                   </div>
                   
                   {/* SKILLS MANAGER */}
                   <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/30">
                       <label className="block text-[10px] font-mono text-purple-400 font-bold uppercase mb-4 flex items-center gap-2">
                           <CpuChipIcon className="w-4 h-4" /> Expertise Matrix
                       </label>
                       
                       {/* Skills List */}
                       <div className="space-y-2 mb-4">
                           {profileData.skills?.map((skill, idx) => (
                               <div key={idx} className="flex justify-between items-center p-2 bg-zinc-950 border border-zinc-800 rounded group">
                                   <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center text-zinc-500">
                                            {/* Simplified icon preview */}
                                            <SparklesIcon className="w-4 h-4" />
                                       </div>
                                       <div>
                                           <p className="text-xs font-bold text-zinc-200">{skill.title}</p>
                                           <p className="text-[10px] text-zinc-500 uppercase">{skill.category}</p>
                                       </div>
                                   </div>
                                   <button onClick={() => removeSkill(idx)} className="text-zinc-600 hover:text-red-400 p-1"><TrashIcon className="w-4 h-4" /></button>
                               </div>
                           ))}
                           {(!profileData.skills || profileData.skills.length === 0) && (
                               <p className="text-xs text-zinc-500 italic text-center py-2">No custom skills added. Using defaults.</p>
                           )}
                       </div>

                       {/* Add Skill Form */}
                       <div className="grid grid-cols-2 gap-2 mb-2">
                           <input name="title" value={newSkill.title} onChange={handleNewSkillChange} placeholder="Skill Title (e.g. Algo Trading)" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-white" />
                           <input name="category" value={newSkill.category} onChange={handleNewSkillChange} placeholder="Category (e.g. Finance)" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-white" />
                       </div>
                       <div className="flex gap-2 mb-2">
                           <select name="icon" value={newSkill.icon} onChange={handleNewSkillChange} className="bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-300 outline-none">
                               {ICON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                           </select>
                           <input name="description" value={newSkill.description} onChange={handleNewSkillChange} placeholder="Short description..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-white" />
                       </div>
                       <button onClick={addSkill} className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] uppercase font-bold rounded border border-zinc-700 transition-colors flex items-center justify-center gap-1">
                           <PlusCircleIcon className="w-3 h-3" /> Add Skill
                       </button>
                   </div>

                   {/* Social Links */}
                   <div className="grid grid-cols-2 gap-4">
                       <div>
                           <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Telegram Link</label>
                           <input name="telegram_link" value={profileData.telegram_link} onChange={handleProfileChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-purple-500 transition-colors outline-none" placeholder="https://t.me/..." />
                       </div>
                       <div>
                           <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">GitHub Link</label>
                           <input name="github_link" value={profileData.github_link} onChange={handleProfileChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-purple-500 transition-colors outline-none" placeholder="https://github.com/..." />
                       </div>
                   </div>
                   <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Contact Email</label>
                        <input name="email" value={profileData.email} onChange={handleProfileChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-purple-500 transition-colors outline-none" />
                   </div>

                   <div className="pt-4">
                        <button onClick={handleSaveProfile} disabled={isPublishing} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all">
                            {isPublishing ? 'Updating System...' : 'Save Profile Configuration'}
                        </button>
                        {publishSuccess && <p className="text-center text-emerald-500 text-xs mt-2 font-mono">PROFILE UPDATED SUCCESSFULLY</p>}
                   </div>
               </div>
           )}

           {/* === MANAGE PROJECTS TAB === */}
           {activeTab === 'MANAGE' && (
               <div className="space-y-3 animate-in fade-in">
                   {existingProjects.map(p => (
                       <div key={p.id} className="flex justify-between items-center p-4 bg-zinc-900/30 border border-zinc-800 hover:bg-zinc-900/50 hover:border-zinc-700 rounded-lg transition-all">
                           <div className="flex items-center gap-4">
                               {p.customImage && <img src={p.customImage} className="w-10 h-10 rounded object-cover opacity-70" />}
                               <div>
                                   <h4 className="text-white font-bold text-sm">{p.title}</h4>
                                   <p className="text-zinc-500 text-xs font-mono mt-0.5 flex gap-2">
                                       <span className={p.status === 'LIVE' ? 'text-emerald-500' : 'text-yellow-500'}>{p.status}</span>
                                       <span>•</span>
                                       <span>{p.type}</span>
                                   </p>
                               </div>
                           </div>
                           <div className="flex gap-2">
                               <button onClick={() => editProject(p)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"><XMarkIcon className="w-4 h-4 rotate-45" /></button> {/* Edit Icon simulated */}
                               <button onClick={() => deleteProject(p.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"><TrashIcon className="w-4 h-4" /></button>
                           </div>
                       </div>
                   ))}
                   {existingProjects.length === 0 && !loadingProjects && (
                       <div className="text-center p-8 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded">No projects deployed yet.</div>
                   )}
               </div>
           )}

           {/* === DEPLOY TAB === */}
           {activeTab === 'DEPLOY' && (
               <div className="animate-in fade-in">
                    {/* AI Auto-Fill */}
                    <div className="mb-6 bg-zinc-900/50 border border-dashed border-zinc-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[10px] text-blue-400 font-mono font-bold uppercase flex items-center gap-2">
                                <SparklesIcon className="w-3 h-3" /> AI Auto-Analysis
                            </label>
                            <span className="text-[9px] text-zinc-500 uppercase">Detects Versions & Stacks</span>
                        </div>
                        <div className="flex gap-2">
                            <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="Paste GitHub or Bitbucket URL..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                            <button onClick={analyzeRepo} disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white text-xs font-bold transition-colors shadow-lg shadow-blue-500/20">
                                {isAnalyzing ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'ANALYZE'}
                            </button>
                        </div>
                        {scannedData && (
                             <div className="mt-3 p-3 bg-zinc-950 border border-emerald-500/30 rounded text-xs text-emerald-400 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                                 <div className="flex flex-col">
                                    <span className="font-bold">Scan Complete</span>
                                    <span className="opacity-70">{scannedData.title}</span>
                                 </div>
                                 <button onClick={applyScannedData} className="bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1 rounded text-[10px] uppercase tracking-wide font-bold transition-colors">
                                     Apply Data
                                 </button>
                             </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Project Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-blue-500 outline-none transition-colors" placeholder="e.g. QTB-X-MAHIR-BOT-PRO-V3" />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-blue-500 outline-none transition-colors" placeholder="System capabilities..." rows={3} />
                        </div>

                        <div>
                             <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Live URL</label>
                             <input name="link" value={formData.link} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-blue-500 outline-none transition-colors" placeholder="https://..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">System Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm outline-none">
                                    <option value="WEB">WEB APP</option>
                                    <option value="BOT">TRADING BOT</option>
                                    <option value="API">API SERVER</option>
                                    <option value="DATA">DATA ANALYTICS</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm outline-none">
                                    <option value="LIVE">LIVE</option>
                                    <option value="BETA">BETA</option>
                                    <option value="DEV">IN DEVELOPMENT</option>
                                    <option value="OFFLINE">OFFLINE</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Tags</label>
                            <input name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white text-sm focus:border-blue-500 outline-none transition-colors" placeholder="ALGO, AI, CRYPTO..." />
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-zinc-900/30 rounded border border-zinc-800 border-dashed">
                             <button onClick={() => fileInputRef.current?.click()} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded text-white border border-zinc-700 transition-colors">Upload Thumbnail</button>
                             <span className="text-xs text-zinc-500 truncate flex-1">{selectedFile ? selectedFile.name : 'No file selected'}</span>
                             <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'PROJECT')} className="hidden" />
                        </div>

                        <button onClick={handlePublish} disabled={isPublishing} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded font-bold text-sm uppercase mt-4 shadow-[0_0_20px_rgba(5,150,105,0.3)] transition-all tracking-widest">
                            {isPublishing ? 'Initiating Deployment...' : (editingId ? 'Update System Config' : 'Deploy System')}
                        </button>
                        {publishSuccess && <p className="text-center text-emerald-500 text-xs mt-2 font-mono">DEPLOYMENT SUCCESSFUL</p>}
                    </div>
               </div>
           )}
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="hidden md:flex w-1/2 bg-[#050505] flex-col items-center justify-center border-l border-zinc-800 relative p-8">
             <div className="absolute top-4 right-4 text-zinc-600 text-xs font-mono flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 PREVIEW MODE
             </div>
             
             {/* Preview Card */}
             <div className="w-full max-w-md bg-[#09090b] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl transform scale-105">
                 <div className="h-9 bg-[#0c0c0e] border-b border-zinc-800 flex items-center px-3 gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                 </div>
                 <div className="h-48 bg-zinc-900 relative overflow-hidden group">
                     <img src={formData.customImage || (selectedFile ? URL.createObjectURL(selectedFile!) : 'https://via.placeholder.com/800x400/111/333?text=SYSTEM+PREVIEW')} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                 </div>
                 <div className="p-5">
                     <div className="flex justify-between items-start mb-2">
                         <h3 className="text-white font-bold text-lg">{formData.title || 'Project Title'}</h3>
                         <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">LIVE</span>
                     </div>
                     <p className="text-zinc-500 text-xs leading-relaxed mb-4">{formData.description || 'System description will appear here...'}</p>
                     <div className="flex gap-2">
                         {(formData.tags || 'TAG1, TAG2').split(',').slice(0,3).map((t, i) => (
                             <span key={i} className="text-[9px] uppercase text-zinc-500 border border-zinc-800 px-2 py-1 rounded">{t}</span>
                         ))}
                     </div>
                 </div>
             </div>
             
             <p className="text-zinc-600 text-[10px] mt-8 font-mono text-center max-w-xs">
                 Changes reflect in real-time across the global network upon deployment.
             </p>
        </div>
      </div>
    </div>
  );
};
