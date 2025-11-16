import React, { useRef } from 'react';

interface HeaderProps {
    onUnlockAdmin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUnlockAdmin }) => {
    const clickCount = useRef(0);
    const lastClickTime = useRef(0);

    const handleHeaderClick = () => {
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

    return (
        <header className="w-full max-w-4xl mx-auto p-4 text-center">
            <div onClick={handleHeaderClick} className="inline-block cursor-pointer" title="Click 10 times to unlock admin panel">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
                    Welcome to Stock Ai Pic
                </h1>
            </div>
             <p className="text-gray-400 mt-1">Developed by Nur Mohammad / Md Alamin</p>
        </header>
    );
};

export default Header;