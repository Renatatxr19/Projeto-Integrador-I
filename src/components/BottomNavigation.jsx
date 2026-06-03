import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'voucher', label: 'QR Code', icon: Heart, path: '/voucher' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#F3ECF8] border-t border-[#E2D4EE] z-[2000] pb-safe shadow-md md:hidden">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto w-full px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          // Determine active tab: matches path prefix or exact path
          const isActive = location.pathname.startsWith(tab.path);
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 w-16 py-2 transition-all duration-200 active:scale-95 rounded-xl ${
                isActive ? 'text-[#7B4D9A]' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon 
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive ? 'fill-[#7B4D9A]/10 scale-105 stroke-[2.5px]' : 'stroke-2'
                }`} 
              />
              <span className={`text-[10px] font-semibold ${isActive ? 'text-[#7B4D9A] font-bold' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;