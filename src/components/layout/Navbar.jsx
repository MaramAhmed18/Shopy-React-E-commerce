// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Info ,ShoppingCart, User, LogOut, Home, PhoneCall, Menu, X } from 'lucide-react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import LogoHeader from '../common/LogoHeader';

export default function Navbar() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const currentPath = location.pathname;

  const handleMobileNav = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-[60] bg-white border-b border-slate-100 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full flex items-center justify-between">

        {/* Brand Group - Now strictly just the Logo */}
        <LogoHeader />

        {/* Desktop Navigation Group */}
        {!isAdmin && (
          <div className="hidden md:flex items-center gap-12">
            <button
              onClick={() => navigate('/home')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${currentPath === '/home' ? "text-[#ff5701]" : "text-slate-400 hover:text-slate-900"}`}
            >
              <Home size={16} /> Home
            </button>
            <button
              onClick={() => navigate('/about')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${currentPath === '/about' ? "text-[#ff5701]" : "text-slate-400 hover:text-slate-900"}`}
            >
              <Info size={16} /> About
            </button>
            <button
              onClick={() => navigate('/contact')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${currentPath === '/contact' ? "text-[#ff5701]" : "text-slate-400 hover:text-slate-900"}`}
            >
              <PhoneCall size={16} /> Contact
            </button>
          </div>
        )}

        {/* Utilities Group - Now contains the Burger Menu on the right */}
        <div className="flex items-center gap-2 ">
          {!isAdmin && (
            <button
              onClick={() => navigate('/cart')}
              className="p-2 text-slate-500 hover:text-[#ff5701] relative transition-colors"
            >
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff5701] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartItems.length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => navigate(isAdmin ? '/admin/profile' : '/account')}
            className={`p-2 transition-colors ${isAdmin ? 'text-[#ff5701]' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <User size={22} />
          </button>

          <button
            onClick={() => signOut(auth)}
            className="hidden sm:block ml-2 p-2 text-slate-300 hover:text-rose-500 transition-colors"
          >
            <LogOut size={22} />
          </button>

          {/* Burger Button - Moved to the far right */}
          {!isAdmin && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all active:scale-95 ml-1"
            >
              {isMenuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Mobile Menu Overlay */}
      {isMenuOpen && !isAdmin && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-8 gap-8">
            <button
              onClick={() => handleMobileNav('/home')}
              className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] transition-all ${currentPath === '/home' ? "text-[#ff5701] translate-x-2" : "text-slate-600 hover:text-slate-900"}`}
            >
              <Home size={18} strokeWidth={2.5} /> Home
            </button>
            <button
              onClick={() => handleMobileNav('/about')}
              className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] transition-all ${currentPath === '/about' ? "text-[#ff5701] translate-x-2" : "text-slate-600 hover:text-slate-900"}`}
            >
              <Info size={18} strokeWidth={2.5} /> About
            </button>
            <button
              onClick={() => handleMobileNav('/contact')}
              className={`flex items-center gap-3  text-xs font-black uppercase tracking-[0.25em] transition-all ${currentPath === '/contact' ? "text-[#ff5701] translate-x-2" : "text-slate-600 hover:text-slate-900"}`}
            >
              <PhoneCall size={18} strokeWidth={2.5} /> Contact
            </button>

            <div className="h-px bg-slate-100 my-2"></div>

            <button
              onClick={() => { signOut(auth); setIsMenuOpen(false); }}
              className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] text-rose-500 hover:text-rose-600 transition-all"
            >
              <LogOut size={18} strokeWidth={2.5} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}