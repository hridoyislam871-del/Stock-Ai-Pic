import React, { useState, useRef } from 'react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToSignup: () => void;
  onUnlockAdmin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup, onUnlockAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  const handleTitleClick = () => {
    const now = Date.now();
    // Reset if clicks are more than 3 seconds apart
    if (now - lastClickTime.current > 3000) {
      clickCount.current = 0;
    }
    clickCount.current += 1;
    lastClickTime.current = now;
    if (clickCount.current === 10) {
      onUnlockAdmin();
      clickCount.current = 0; // Reset after unlocking
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen sm:min-h-0 px-4">
      <div className="w-full max-w-md">
        <div
          className="text-center mb-8 cursor-pointer group"
          onClick={handleTitleClick}
          title="Click 10 times to unlock admin panel"
        >
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text transition-transform duration-300 group-hover:scale-105">
                Welcome Back to Stock Ai Pic
            </h2>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-300">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-300">Password</label>
                <button type="button" className="text-sm text-indigo-400 hover:underline focus:outline-none">Forgot Password?</button>
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
              Log In
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-400">
            Don’t have an account?{' '}
            <button onClick={onNavigateToSignup} className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;