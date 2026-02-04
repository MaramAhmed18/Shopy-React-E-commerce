import React from 'react';
import { Link } from 'react-router-dom'

const LogoHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center lg:items-start">
      {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 group">
          <div className="bg-[#ff5701] text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xl transition-transform group-hover:scale-105">
            S
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Shopy</span>
        </Link>
    </div>
  );
};

export default LogoHeader;