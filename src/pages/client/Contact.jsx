// src/pages/client/Contact.jsx
import { useState } from "react"; //
import { useFormik } from "formik"; //
import * as Yup from "yup"; //
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import NotificationBadge from "../../components/common/NotificationBadge"; //
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function Contact() {
  const [notification, setNotification] = useState(null); //

  // Define validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    message: Yup.string()
      .required("Message is required")
      .min(10, "Message must be at least 10 characters")
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: ""
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Mocking API call for demonstration
        console.log("Contact form submitted:", values);
        setNotification({ type: "success", message: "Your message has been sent!" });
        resetForm();
      } catch (error) {
        setNotification({ type: "error", message: "Something went wrong. Please try again." });
      }
    }
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {notification && (
        <NotificationBadge 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      <main className="max-w-5xl mx-auto px-4 py-20 flex-grow">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Contact Us</h1>
          <p className="text-slate-500 font-medium">Have a question? We're here to help you.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="text-[#ff5701]" />
            <h2 className="font-black text-xl">Send a Message</h2>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                {...formik.getFieldProps("name")}
                className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold text-sm ${
                  formik.touched.name && formik.errors.name 
                    ? "border-red-500 focus:bg-white" 
                    : "border-transparent focus:bg-white focus:border-[#ff5701]"
                }`} 
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                {...formik.getFieldProps("email")}
                className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold text-sm ${
                  formik.touched.email && formik.errors.email 
                    ? "border-red-500 focus:bg-white" 
                    : "border-transparent focus:bg-white focus:border-[#ff5701]"
                }`} 
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <textarea 
                name="message"
                placeholder="How can we help?" 
                rows="4" 
                {...formik.getFieldProps("message")}
                className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold text-sm ${
                  formik.touched.message && formik.errors.message 
                    ? "border-red-500 focus:bg-white" 
                    : "border-transparent focus:bg-white focus:border-[#ff5701]"
                }`}
              ></textarea>
              {formik.touched.message && formik.errors.message && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{formik.errors.message}</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="w-full bg-[#ff5701] text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-[#e64e00] transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Sending..." : <><Send size={16} /> Send Message</>}
            </button>
          </form>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 ">
          <div className="p-8 bg-slate-50 rounded-[2rem] text-center border border-slate-100 hover:border-[#ff5701]/20 transition-all">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><Mail className="text-[#ff5701]" size={20} /></div>
            <h3 className="font-black text-sm uppercase tracking-widest mb-2">Email</h3>
            <p className="text-slate-500 text-xs font-bold">support@shopy.com</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2rem] text-center border border-slate-100 hover:border-[#ff5701]/20 transition-all">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><Phone className="text-[#ff5701]" size={20} /></div>
            <h3 className="font-black text-sm uppercase tracking-widest mb-2">Phone</h3>
            <p className="text-slate-500 text-xs font-bold">+20 123 456 7890</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2rem] text-center border border-slate-100 hover:border-[#ff5701]/20 transition-all">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><MapPin className="text-[#ff5701]" size={20} /></div>
            <h3 className="font-black text-sm uppercase tracking-widest mb-2">Office</h3>
            <p className="text-slate-500 text-xs font-bold">Cairo, Egypt</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}