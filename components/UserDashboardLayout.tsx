import React, { useState } from 'react';
import type { User } from '../App';

interface UserDashboardLayoutProps {
  currentUser: User;
  onLogout: () => void;
  activeView: 'generator' | 'subscriptions';
  setActiveView: (view: 'generator' | 'subscriptions') => void;
  onOpenPrivacy: () => void;
  children: React.ReactNode;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({ 
    currentUser, 
    onLogout, 
    activeView, 
    setActiveView, 
    onOpenPrivacy, 
    children 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'generator' | 'subscriptions') => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };
  
  const handlePrivacyClick = () => {
    onOpenPrivacy();
    setIsMobileMenuOpen(false);
  }

  const NavContent = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
            Stock Ai Pic
        </h1>
        <p className="text-xs text-gray-500">By Nur Mohammad / Md Alamin</p>
      </div>
      <nav className="flex flex-col space-y-2 flex-grow">
        <NavItem 
            label="Image Generator" 
            view="generator"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>} 
        />
        <NavItem 
            label="Buy Credits" 
            view="subscriptions" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.134 0v-1.43zM11.567 7.151c.22.071.412.164.567.267v1.43a2.5 2.5 0 00-1.134 0V7.151z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.876.654A1 1 0 006.25 6.51v1.435a1 1 0 001.448.894A2.5 2.5 0 0110 9.5a2.5 2.5 0 012.302-1.161A1 1 0 0013.75 6.945V5.51a1 1 0 00-1.124-.967 4.5 4.5 0 00-1.876-.654V5z" clipRule="evenodd" /></svg>}
        />
      </nav>
      <div className="mt-auto">
        <button
            onClick={handlePrivacyClick}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            <span className="ml-3">Privacy & Policy</span>
        </button>
      </div>
    </>
  );

  const NavItem: React.FC<{
    label: string;
    view: 'generator' | 'subscriptions';
    // FIX: Replaced JSX.Element with React.ReactNode to resolve the "Cannot find namespace 'JSX'" error,
    // as React.ReactNode is available through the React import and is a suitable type for renderable content.
    icon: React.ReactNode;
  }> = ({ label, view, icon }) => (
    <button
      onClick={() => handleNavClick(view)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        activeView === view
          ? 'bg-indigo-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );

  return (
    <div className="flex w-full min-h-screen">
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 p-4 fixed h-full">
        <NavContent />
      </aside>

      {/* --- Mobile Menu --- */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      ></div>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 p-4 z-40 transform transition-transform md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </aside>

      {/* --- Main Content --- */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <header className="w-full bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
             <div className="md:hidden">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
                  aria-label="Open menu"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
             </div>
             <div className="flex-1" /> {/* Spacer */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                <p className="text-xs font-bold text-cyan-400">{currentUser.credits} Credits</p>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 rounded-full text-gray-400 hover:bg-red-600 hover:text-white transition-colors"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;