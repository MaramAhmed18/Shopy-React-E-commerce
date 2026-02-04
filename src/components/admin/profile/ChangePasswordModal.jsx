// src/components/admin/profile/ChangePasswordModal.jsx
import { useState } from "react";
import { X, Lock, Loader2, ShieldCheck } from "lucide-react";

export default function ChangePasswordModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    setLoading(true);
    // Logic for Firebase re-authentication and update would go here
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-black text-slate-900 mb-2">Change Password</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Secure your administrative access</p>

        <form onSubmit={handleUpdate} className="space-y-4 text-left">
          <PasswordInput 
            label="Current Password" 
            value={passwords.current} 
            onChange={(v) => setPasswords({...passwords, current: v})} 
          />
          <PasswordInput 
            label="New Password" 
            value={passwords.new} 
            onChange={(v) => setPasswords({...passwords, new: v})} 
          />
          <PasswordInput 
            label="Confirm New Password" 
            value={passwords.confirm} 
            onChange={(v) => setPasswords({...passwords, confirm: v})} 
          />

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-[#ff5701] to-orange-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest  transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldCheck size={14}/> Update Password</>}
          </button>
        </form>
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
        <input 
          type="password"
          required
          className="w-full p-3.5 pl-12 bg-slate-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#ff5701] outline-none transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}