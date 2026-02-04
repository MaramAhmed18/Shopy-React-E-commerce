// src/components/admin/profile/EditProfileModal.jsx
import { useState } from "react";
import { X, Loader2, User, Phone } from "lucide-react";
import { updateUserProfile } from "../../../utils/firebaseHelper";

export default function EditProfileModal({ onClose, user }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    phone: user?.phone || ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(user.uid, formData);
      window.location.reload(); // Refresh to reflect changes
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-black text-slate-900 mb-2">Edit Profile</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Update your public identity</p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                required
                className="w-full p-3.5 pl-12 bg-slate-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#ff5701] outline-none transition-all"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                className="w-full p-3.5 pl-12 bg-slate-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#ff5701] outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="01xxxxxxxxx"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 bg-gradient-to-r from-[#ff5701] to-orange-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest  transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}