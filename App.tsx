import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import AdminLoginModal from './components/AdminLoginModal';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminDashboard from './components/AdminDashboard';
import SubscriptionPage from './components/SubscriptionPage';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import UserDashboardLayout from './components/UserDashboardLayout';
import { generateImage } from './services/geminiService';

// --- Types ---
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  credits: number;
  createdAt: string;
  isBanned: boolean;
  isSubscribed: boolean;
};

export type Plan = {
  id: string;
  name: string;
  credits: number;
  priceBdt: number;
  priceUsd: number;
  paymentInstructions: string;
};

export type PurchaseRequest = {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  transactionId: string;
  status: 'pending' | 'approved';
  createdAt: string;
};

export type GenerationJob = {
    id: string;
    prompt: string;
    aspectRatio: string;
    status: 'generating' | 'completed' | 'failed';
    imageUrl: string | null;
    error: string | null;
};

export type DownloadQuality = 'normal' | 'hd' | '2k';

type View = 'landing' | 'login' | 'signup' | 'dashboard' | 'admin';
type DashboardView = 'generator' | 'subscriptions';

const App: React.FC = () => {
  // --- State Management ---
  const [view, setView] = useState<View>('landing');
  const [dashboardView, setDashboardView] = useState<DashboardView>('generator');
  
  // Data State
  const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('stock_ai_pic_users') || '[]'));
  const [plans, setPlans] = useState<Plan[]>(() => JSON.parse(localStorage.getItem('stock_ai_pic_plans') || JSON.stringify([
    { id: 'plan_1', name: 'Starter Pack', credits: 100, priceBdt: 200, priceUsd: 2, paymentInstructions: 'Send 200 BDT or 2 USD to bKash number 01234567890 with your email as reference.' },
    { id: 'plan_2', name: 'Pro Pack', credits: 500, priceBdt: 800, priceUsd: 8, paymentInstructions: 'Send 800 BDT or 8 USD to bKash number 01234567890 with your email as reference.' }
  ])));
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(() => JSON.parse(localStorage.getItem('stock_ai_pic_purchases') || '[]'));
  
  // Auth & Session State
  const [currentUser, setCurrentUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('stock_ai_pic_currentUser') || 'null'));
  const [isAdmin, setIsAdmin] = useState<boolean>(() => JSON.parse(localStorage.getItem('stock_ai_pic_isAdmin') || 'false'));
  
  // UI State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [downloadQuality, setDownloadQuality] = useState<DownloadQuality>('normal');

  // Image Generation State
  const [generationJobs, setGenerationJobs] = useState<GenerationJob[]>([]);

  // --- Effects for State Persistence ---
  useEffect(() => { localStorage.setItem('stock_ai_pic_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('stock_ai_pic_plans', JSON.stringify(plans)); }, [plans]);
  useEffect(() => { localStorage.setItem('stock_ai_pic_purchases', JSON.stringify(purchaseRequests)); }, [purchaseRequests]);
  useEffect(() => { localStorage.setItem('stock_ai_pic_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('stock_ai_pic_isAdmin', JSON.stringify(isAdmin)); }, [isAdmin]);

  // --- Initial View ---
  useEffect(() => {
    if (isAdmin) setView('admin');
    else if (currentUser) setView('dashboard');
    else setView('landing');
  }, [isAdmin, currentUser]);

  // --- Handlers ---

  const handleGenerate = useCallback(async (prompt: string, aspectRatio: string) => {
    if (!prompt.trim() || !currentUser || currentUser.credits <= 0) return;

    const newJob: GenerationJob = {
        id: `job_${Date.now()}`,
        prompt,
        aspectRatio,
        status: 'generating',
        imageUrl: null,
        error: null,
    };

    setGenerationJobs(prev => [newJob, ...prev]);

    // Optimistically decrement credits
    const updatedUser = { ...currentUser, credits: currentUser.credits - 1 };
    setCurrentUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));

    try {
        const url = await generateImage(prompt, aspectRatio);
        setGenerationJobs(prev => prev.map(job => job.id === newJob.id ? { ...job, status: 'completed', imageUrl: url } : job));
    } catch (err) {
        setGenerationJobs(prev => prev.map(job => job.id === newJob.id ? { ...job, status: 'failed', error: err instanceof Error ? err.message : 'An unexpected error occurred.' } : job));
        
        // Refund credit on failure
        const refundedUser = { ...updatedUser, credits: updatedUser.credits + 1 };
        setCurrentUser(refundedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? refundedUser : u));
    }
  }, [currentUser]);

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const successfulJobs = generationJobs.filter(job => job.status === 'completed' && job.imageUrl);

    if (successfulJobs.length === 0 || !currentUser?.isSubscribed) return;

    // Helper function to robustly convert a data URL to a Blob, avoiding fetch issues.
    const dataURLtoBlob = (dataurl: string): Blob | null => {
        const arr = dataurl.split(',');
        if (arr.length < 2) return null;
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) return null;
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    successfulJobs.forEach(job => {
        if (job.imageUrl) {
            const blob = dataURLtoBlob(job.imageUrl);
            if (blob) {
                const qualityTag = downloadQuality === 'normal' ? '' : `_${downloadQuality.toUpperCase()}`;
                const fileName = `${job.prompt.slice(0, 20).replace(/\s+/g, '_')}${qualityTag}_${job.id}.jpg`;
                zip.file(fileName, blob);
            } else {
                 console.error(`Could not convert data URL to blob for job ${job.id}`);
            }
        }
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `Stock_Ai_Pic_Images_${downloadQuality}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }).catch(err => {
        console.error("Error generating zip file:", err);
        alert("An error occurred while creating the zip file. Please try again.");
    });
};


  const handleSignup = (name: string, email: string, password: string) => {
    if (users.some(user => user.email === email)) {
      alert('An account with this email already exists.');
      return;
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      password, // In a real app, hash this password
      credits: 50, // New users get 50 free credits
      createdAt: new Date().toLocaleString(),
      isBanned: false,
      isSubscribed: false,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    setView('dashboard');
    setDashboardView('generator');
  };

  const handleLogin = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      if (user.isBanned) {
        alert('Your account has been banned. Please contact support.');
        return;
      }
      setCurrentUser(user);
      setView('dashboard');
      setDashboardView('generator');
    } else {
      alert('Invalid credentials.');
    }
  };

  const handleAdminLogin = (email: string, password: string) => {
    if (email === 'hridoyadminxxy@gmail.com' && password === 'hridoyadminxxy@@##') {
      setIsAdmin(true);
      setView('admin');
      setIsAdminModalOpen(false);
    } else {
      alert('Invalid admin credentials.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('stock_ai_pic_currentUser');
    localStorage.removeItem('stock_ai_pic_isAdmin');
    setView('landing');
  };

  const handleAddPlan = (plan: Omit<Plan, 'id'>) => {
    const newPlan: Plan = { ...plan, id: `plan_${Date.now()}` };
    setPlans(prev => [...prev, newPlan]);
  };
  
  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
        setPlans(prev => prev.filter(p => p.id !== planId));
    }
  };

  const handlePurchaseRequest = (plan: Plan, transactionId: string) => {
    if (!currentUser) return;
    const newRequest: PurchaseRequest = {
      id: `pr_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      planId: plan.id,
      planName: plan.name,
      transactionId,
      status: 'pending',
      createdAt: new Date().toLocaleString(),
    };
    setPurchaseRequests(prev => [...prev, newRequest]);
    alert('Purchase request submitted! Admin will review it shortly.');
    setDashboardView('generator');
  };

  const handleApprovePurchase = (purchaseId: string) => {
    const request = purchaseRequests.find(pr => pr.id === purchaseId);
    if (!request) return;

    const plan = plans.find(p => p.id === request.planId);
    if (!plan) return;

    // Add credits to user and mark as subscribed
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === request.userId) {
        const updatedUser = { ...u, credits: u.credits + plan.credits, isSubscribed: true };
        if (currentUser && currentUser.id === u.id) {
          setCurrentUser(updatedUser);
        }
        return updatedUser;
      }
      return u;
    }));

    setPurchaseRequests(prev => prev.map(pr => pr.id === purchaseId ? { ...pr, status: 'approved' } : pr));
  };
  
  const handleBanUser = (userId: string) => {
     setUsers(prev => prev.map(u => u.id === userId ? {...u, isBanned: !u.isBanned} : u));
  };
  
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
        setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };


  // --- Render Logic ---
  const renderView = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setView('signup')} onUnlockAdmin={() => setIsAdminModalOpen(true)} />;
      case 'signup':
        return <SignupPage onSignup={handleSignup} onNavigateToLogin={() => setView('login')} />;
      case 'admin':
        return (
          <div className="w-full max-w-7xl mx-auto">
            <AdminDashboard 
              users={users} 
              plans={plans}
              purchaseRequests={purchaseRequests}
              onAddPlan={handleAddPlan}
              onDeletePlan={handleDeletePlan}
              onApprovePurchase={handleApprovePurchase}
              onBanUser={handleBanUser}
              onDeleteUser={handleDeleteUser}
              onLogout={handleLogout} 
            />
          </div>
        );
      case 'dashboard':
        if (!currentUser) { setView('login'); return null; }
        return (
          <UserDashboardLayout
            currentUser={currentUser}
            onLogout={handleLogout}
            activeView={dashboardView}
            setActiveView={setDashboardView}
            onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          >
            {dashboardView === 'generator' && (
              <main className="flex flex-col gap-8">
                <PromptInput 
                  handleGenerate={handleGenerate} 
                  isLoading={generationJobs.some(j => j.status === 'generating')} 
                  disabled={currentUser.credits <= 0}
                />
                <ImageDisplay 
                  jobs={generationJobs} 
                  isSubscribed={currentUser.isSubscribed} 
                  onDownloadAll={handleDownloadAll}
                  downloadQuality={downloadQuality}
                  setDownloadQuality={setDownloadQuality}
                />
              </main>
            )}
            {dashboardView === 'subscriptions' && (
              <SubscriptionPage 
                plans={plans} 
                onPurchase={handlePurchaseRequest} 
                onBack={() => setDashboardView('generator')} 
              />
            )}
          </UserDashboardLayout>
        );
      case 'landing':
      default:
        return (
          <div className="w-full max-w-7xl mx-auto">
            <Header onUnlockAdmin={() => setIsAdminModalOpen(true)} />
            <div className="text-center mt-12">
              <p className="text-lg text-gray-400 mb-8">The ultimate tool for AI-powered image generation.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setView('login')} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold">User Login</button>
                <button onClick={() => setView('signup')} className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold">Create Account</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
          {renderView()}
      </div>
      {isAdminModalOpen && <AdminLoginModal onClose={() => setIsAdminModalOpen(false)} onLogin={handleAdminLogin} />}
      {isPrivacyModalOpen && <PrivacyPolicyModal onClose={() => setIsPrivacyModalOpen(false)} />}
    </>
  );
};

export default App;