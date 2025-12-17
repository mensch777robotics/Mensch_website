import React, { useState, useEffect } from 'react';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

const navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Mission', path: '/#mission' },
    { label: 'The Fleet', path: '/fleet' },
    { label: 'Contact', path: '/contact' },
];

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    const isActive = (path: string) => {
        if (path.startsWith('/#') && location.pathname === '/') return false;
        return location.pathname === path;
    }

    return (
        <header 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
                scrolled 
                    ? 'bg-background-dark/80 backdrop-blur-xl border-white/5 py-4' 
                    : 'bg-transparent border-transparent py-6'
            }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
                
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2 group relative z-50 hover:opacity-80 transition-opacity">
                    <Logo className="scale-90 md:scale-100 origin-left" />
                </Link>

                {/* Desktop Nav - Centered Pod */}
                <div className="hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <nav className="flex items-center gap-1 rounded-full border border-white/5 bg-white/5 p-1.5 backdrop-blur-md shadow-2xl shadow-black/20">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    isActive(item.path) 
                                        ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-4 relative z-50">
                    <Link 
                        to="/contact" 
                        className="group relative flex h-11 items-center justify-center overflow-hidden rounded-full bg-white px-6 text-sm font-bold text-black transition-all hover:bg-slate-200 hover:scale-105"
                    >
                        <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-[150%]">Get in Touch</span>
                        <span className="absolute z-10 translate-y-[150%] transition-transform duration-300 group-hover:translate-y-0 flex items-center gap-1">
                            Let's Talk <span className="material-symbols-outlined text-sm font-bold">arrow_outward</span>
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden relative z-50 h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'none' }}>
                        {mobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-background-dark/95 backdrop-blur-3xl transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-8 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {navItems.map((item, idx) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-4xl font-display font-bold tracking-tight text-white transition-all duration-500 hover:text-primary ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                        <span className="text-slate-600 mr-4 text-2xl font-light">0{idx + 1}</span>
                        {item.label}
                    </Link>
                ))}
                <div 
                    className={`mt-8 w-full px-10 transition-all duration-500 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '400ms' }}
                >
                    <Link 
                        to="/contact"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-white text-lg font-bold text-black active:scale-95 transition-transform"
                    >
                        Get in Touch
                        <span className="material-symbols-outlined">arrow_outward</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};