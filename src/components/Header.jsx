import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Show back button on all pages except home and login
  const showBack = location.pathname !== '/home' && location.pathname !== '/';

  const navLinks = [
    { label: 'Perfil', path: '/profile' },
  ];

  return (
    <header className="bg-[#E6D9F2] sticky top-0 z-[2000] h-16 flex items-center px-6 border-b border-purple-200/50 shadow-sm">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="text-[#7B4D9A] hover:text-[#5E3A75] transition-colors p-1.5 -ml-2.5 rounded-full hover:bg-[#7B4D9A]/10 mr-2 flex items-center justify-center"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            </button>
          )}
          <h1 className="text-lg font-bold text-[#5E3A75] tracking-tight">
            {title || "Rede Solidária"}
          </h1>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`text-sm font-bold transition-all duration-150 relative py-1 ${
                  isActive 
                    ? 'text-[#7B4D9A]' 
                    : 'text-muted-foreground hover:text-[#5E3A75]'
                }`}
              >
                {link.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B4D9A] rounded-full animate-in fade-in zoom-in-95"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;