// src/pages/auth/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { auth } from '../../config/firebase.js'; 
import LogoHeader from '../../components/common/LogoHeader.jsx'; 
import { Loader2, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react'; 

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const actionCodeSettings = {
      url: 'http://localhost:5173/login', 
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setMessage('A reset link has been sent to your inbox.');
    } catch (err) {
      console.error('Reset error:', err);
      setError('Failed to send reset email. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      
      {/* Left Side: Reset Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white w-full lg:w-[45%]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          <div className="mt-15">
            {message ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-6">
                  <MailCheck className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Check your email</h3>
                <p className="mt-2 text-sm text-slate-500 mb-8">{message}</p>
                <Link to="/login" className="text-sm font-bold text-[#ff5701] hover:text-[#e64e00] flex items-center justify-left gap-2 transition-colors">
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            ) : (
              //  Wrapped adjacent elements in a Fragment
              <>
                <div className="text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-5 transform scale-125 origin-center lg:origin-left">
                    <LogoHeader title="" subtitle="" /> 
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-18">Reset Password</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Enter your email to receive a password recovery link.
                  </p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 text-left">Email address</label>
                    <div className="mt-2">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#ff5701] outline-none transition-all sm:text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100 animate-in fade-in">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center items-center rounded-lg bg-[#ff5701] px-3 py-3 text-sm font-bold text-white shadow-md hover:bg-[#e64e00] transition-all disabled:opacity-70 group"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Send Reset Link 
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <div className="text-center mt-6">
                    <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2 transition-colors">
                      <ArrowLeft size={16} /> Back to Login
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Branded Visual */}
      <div className="relative hidden flex-1 lg:block bg-slate-100">
         <img 
            className="absolute inset-0 h-full w-full object-cover" 
            src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2070&auto=format&fit=crop" 
            alt="Security Visual" 
         />
         <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
         <div className="absolute inset-0 flex items-end p-20 text-white z-10">
          <div>
            <h3 className="text-4xl font-extrabold leading-tight">
              "Security is our priority."
            </h3>
            <p className="mt-4 text-xl text-orange-50 opacity-90">
              Recover your account safely and quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}