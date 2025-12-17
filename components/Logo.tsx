import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* 
              Assuming the user's logo file is named 'logo.png' and is in the public directory.
              If the file has a different name, please update the src below.
            */}
            <img 
                src="logo.png" 
                alt="Mensch Robotics Logo" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('fallback-active');
                }}
            />
            {/* Fallback text only visible if image fails (handled via CSS/JS logic implicitly or just kept alongside if desired) 
                For now, we rely on the image. If you prefer text alongside the logo, uncomment below.
            */}
            <div className="flex flex-col justify-center leading-none">
                <span className="font-display font-bold text-white tracking-wider text-lg">MENSCH</span>
                <span className="font-display font-bold text-white tracking-[0.36em] text-[0.6rem] ml-[1px] text-slate-300">ROBOTICS</span>
            </div>
        </div>
    );
};