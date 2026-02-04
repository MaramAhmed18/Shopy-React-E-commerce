// src/pages/admin/AdminProfile.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import EditProfileModal from "../../components/admin/profile/EditProfileModal";
import ChangePasswordModal from "../../components/admin/profile/ChangePasswordModal";

export default function AdminProfile() {
    const { user } = useAuth();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPassModal, setShowPassModal] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-12 text-left">

                <Link to="/admin" className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-10 hover:text-slate-900 transition-colors">
                    <ArrowLeft size={14} /> Back to Dashboard
                </Link>

                <h1 className="text-2xl font-black text-slate-900 mb-8 tracking-tight uppercase">My Profile</h1>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <div className="h-32 bg-gradient-to-r from-[#ff5701] to-orange-400 relative">
                        <div className="absolute -bottom-10 left-10 w-24 h-24 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center shadow-md">
                            <span className="text-3xl font-black text-slate-300">A</span>
                        </div>
                    </div>

                    <div className="pt-16 pb-10 px-10">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">{user?.username || "Admin User"}</h2>
                                <p className="text-sm text-slate-400 font-medium">{user?.email}</p>
                            </div>
                            <span className="bg-orange-50 text-[#ff5701] text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                                {user?.role}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-12 border-t border-slate-50 pt-8">
                            <InfoGroup label="Username" value={user?.username} />
                            <InfoGroup label="Account Type" value={user?.role} />
                            <InfoGroup label="Contact Email" value={user?.email} />
                            <InfoGroup label="Joined Shopy" value={user?.createdAt?.split('T')[0]} />
                            <InfoGroup label="Phone Number" value={user?.phone || "Not provided"} />

                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => setShowPassModal(true)}
                                className="border-2 border-slate-100 text-slate-500 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Security Settings
                            </button>
                        </div>
                    </div>
                </div>

                {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} user={user} />}
                {showPassModal && <ChangePasswordModal onClose={() => setShowPassModal(false)} />}
            </main>
        </div>
    );
}

function InfoGroup({ label, value, isMuted }) {
    return (
        <div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">{label}</p>
            <p className={`font-bold text-sm ${isMuted ? 'text-slate-300 bg-slate-50 px-3 py-1.5 rounded-lg truncate text-xs' : 'text-slate-900'}`}>
                {value}
            </p>
        </div>
    );
}