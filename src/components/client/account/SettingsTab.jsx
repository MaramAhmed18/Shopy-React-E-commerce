// src/components/client/account/SettingsTab.jsx
import { useState } from "react";
import { Lock, AlertTriangle } from "lucide-react";
import { updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import NotificationBadge from "../../common/NotificationBadge";

export default function SettingsTab() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // 1. Define handlePasswordChange FIRST to avoid initialization errors
  const handlePasswordChange = async (values) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, values.newPassword);
      setNotification({ type: "success", message: "Password updated successfully!" });
      formik.resetForm();
    } catch (error) {
      console.error("Error updating password:", error);
      setNotification({ 
        type: "error", 
        message: "Failed to update password. Please check your current password." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Validation schema for password change form
  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required("Current password is required")
      .min(6, "Password must be at least 6 characters"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters")
      .notOneOf(
        [Yup.ref("currentPassword")],
        "New password must be different from current password"
      )
  });

  // 2. Initialize useFormik after the handler function is defined
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: ""
    },
    validationSchema,
    onSubmit: handlePasswordChange
  });

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      await deleteUser(user);
      setNotification({ type: "success", message: "Account deleted successfully." });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Error deleting account:", error);
      setNotification({ 
        type: "error", 
        message: "Failed to delete account. Please try again." 
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-xl animate-in fade-in duration-300">
      {notification && (
        <NotificationBadge 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <h2 className="text-lg font-black text-slate-900 mb-2">Account Settings</h2>
      <p className="text-slate-400 text-xs font-medium mb-8">Manage your password and account security.</p>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xs font-black text-slate-900 mb-5 flex items-center gap-2 uppercase tracking-wider">
            <Lock size={14} className="text-[#ff5701]"/> Change Password
          </h3>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Current password"
                {...formik.getFieldProps("currentPassword")}
                className={`w-full p-3.5 bg-slate-50 border-2 rounded-xl text-sm font-bold outline-none transition-all ${
                  formik.touched.currentPassword && formik.errors.currentPassword
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-transparent focus:ring-2 focus:ring-slate-900"
                }`}
              />
              {formik.touched.currentPassword && formik.errors.currentPassword && (
                <p className="text-red-600 text-xs font-bold mt-1">{formik.errors.currentPassword}</p>
              )}
            </div>

            <div>
              <input 
                type="password" 
                placeholder="New password"
                {...formik.getFieldProps("newPassword")}
                className={`w-full p-3.5 bg-slate-50 border-2 rounded-xl text-sm font-bold outline-none transition-all ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-transparent focus:ring-2 focus:ring-slate-900"
                }`}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="text-red-600 text-xs font-bold mt-1">{formik.errors.newPassword}</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading || !formik.isValid}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <h3 className="text-xs font-black text-rose-500 mb-2 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={14} /> Danger Zone
          </h3>
          <p className="text-[11px] text-slate-400 mb-6 font-medium leading-relaxed">
            Once you delete your account, there is no going back. All order history and data will be permanently removed.
          </p>
          <button 
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="border-2 border-rose-500 text-rose-500 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteLoading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}