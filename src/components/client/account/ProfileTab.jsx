// src/components/client/account/ProfileTab.jsx
import { useState } from "react";
import { User, Mail, Phone, ShieldCheck, CalendarDays } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUserProfile } from "../../../utils/firebaseHelper";
import NotificationBadge from "../../common/NotificationBadge";

export default function ProfileTab({ user, profile, onProfileUpdate }) {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // 1. Define the handler function FIRST
  const handleSave = async (values) => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      await updateUserProfile(user.uid, { 
        name: values.name, 
        phone: values.phone
      });
      setNotification({ type: "success", message: "Profile updated successfully!" });
      onProfileUpdate(); 
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({ type: "error", message: "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    phone: Yup.string()
      .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im, "Please enter a valid phone number")
      .notRequired()
  });

  // 2. Now useFormik can safely reference handleSave
  const formik = useFormik({
    initialValues: {
      name: profile?.name || user?.displayName || "",
      phone: profile?.phone || ""
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSave // Reference is now valid
  });

  return (
    <div className="animate-in fade-in duration-300">
      {notification && (
        <NotificationBadge 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="mb-10">
        <h2 className="text-xl font-black text-slate-900 mb-1">Account Information</h2>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">General Settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* First Column: Non-editable Information */}
        <div className="space-y-8">
          <div>
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-3">Email Address</label>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                <Mail size={18} />
              </div>
              <span className="font-bold text-slate-900">{user?.email}</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-3">Account Role</label>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-purple-500">
                <ShieldCheck size={18} />
              </div>
              <span className="font-bold text-slate-900 capitalize">{profile?.role || "User"}</span>
            </div>
          </div>

          {/* NEW: Read-only Member Since Field */}
          <div>
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-3">Member Since</label>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-[#ff5701]">
                <CalendarDays size={18} />
              </div>
              <span className="font-bold text-slate-900">
                {profile?.createdAt ? profile.createdAt.split('T')[0] : "Joined Recently"}
              </span>
            </div>
          </div>
        </div>

        {/* Second Column: Editable Form */}
        <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff5701] transition-colors" />
                <input 
                  type="text"
                  {...formik.getFieldProps("name")}
                  className={`w-full p-3.5 pl-12 bg-white text-slate-900 border-2 rounded-2xl font-bold text-sm focus:ring-0 outline-none shadow-sm transition-all ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-transparent focus:border-[#ff5701]"
                  }`}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-600 text-xs font-bold mt-1">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#ff5701] transition-colors" />
                <input 
                  type="tel"
                  {...formik.getFieldProps("phone")}
                  className={`w-full p-3.5 pl-12 bg-white text-slate-900 border-2 rounded-2xl font-bold text-sm focus:ring-0 outline-none shadow-sm transition-all ${
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-transparent focus:border-[#ff5701]"
                  }`}
                />
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-600 text-xs font-bold mt-1">{formik.errors.phone}</p>
              )}
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading || !formik.isValid}
                className="w-full bg-[#ff5701] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-100 hover:bg-[#e64e00] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}