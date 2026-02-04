// src/components/layout/Footer.jsx
import { ShoppingBag, Instagram, Facebook, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-8 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-left">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/home" className="flex items-center gap-2 mb-6">
              <div className="bg-[#ff5701] p-1.5 rounded-lg">
                <ShoppingBag className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight italic">Shopy</span>
            </Link>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Premium sneakers and accessories curated for the modern explorer. Quality first, always.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Shop</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><Link to="/home" className="hover:text-[#ff5701] transition-colors">All Products</Link></li>
              <li><Link to="/home" className="hover:text-[#ff5701] transition-colors">New Arrivals</Link></li>
              
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><Link to="/account" className="hover:text-[#ff5701] transition-colors">Order Tracking</Link></li>
              <li><Link to="/contact" className="hover:text-[#ff5701] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-[#ff5701] hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-[#ff5701] hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-[#ff5701] hover:text-white transition-all"><Phone size={18} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-50  text-slate-400">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            © {currentYear} Shopy Collection. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}