// src/pages/client/Account.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserOrders, getUserProfile } from "../../utils/firebaseHelper";
import Navbar from "../../components/layout/Navbar";
import { 
  User, Package, Settings, ArrowLeft, LogOut, Loader2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import ProfileTab from "../../components/client/account/ProfileTab";
import OrdersTab from "../../components/client/account/OrdersTab";
import SettingsTab from "../../components/client/account/SettingsTab";
import Footer from "../../components/layout/Footer";

export default function Account() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = () => {
    if (user?.uid) {
      getUserProfile(user.uid)
        .then(setProfile)
        .catch(err => console.error("Profile fetch failed:", err));
    }
  };

  useEffect(() => {
    fetchProfile();
    // Fetch user orders only when the orders tab is active
    if (activeTab === "orders" && user?.uid) {
      setLoading(true);
      getUserOrders(user.uid)
        .then(setOrders)
        .catch(err => console.error("History fetch failed:", err))
        .finally(() => setLoading(false));
    }
  }, [activeTab, user?.uid]);

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={14} /> },
    { id: "orders", label: "Orders", icon: <Package size={14} /> },
    { id: "settings", label: "Settings", icon: <Settings size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 antialiased font-sans">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 text-left">
        <button 
          onClick={() => navigate("/home")} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft size={12} /> Back to Home
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Account</h1>
        
        </div>

        <div className="flex gap-1 mb-8 bg-white p-1.5 rounded-2xl w-fit shadow-sm border border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all ${
                activeTab === tab.id 
                ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm min-h-[450px] animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === "profile" && (
            <ProfileTab user={user} profile={profile} onProfileUpdate={fetchProfile} />
          )}
          {activeTab === "orders" && (
            <OrdersTab orders={orders} loading={loading} />
          )}
          {activeTab === "settings" && (
            <SettingsTab />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}