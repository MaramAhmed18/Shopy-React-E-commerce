// src/pages/auth/Signup.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase.js';
import LogoHeader from '../../components/common/LogoHeader.jsx';
import { Loader2, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    if (password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
        role: role,
        createdAt: new Date().toISOString()
      });
      navigate('/login'); 
    } catch (error) {
      let msg = "Failed to create account.";
      if (error.code === 'auth/email-already-in-use') msg = "This email is already in use.";
      setError(msg);
      console.error('Error creating Account:', error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      
      {/* Left Side: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white w-full lg:w-[45%]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Logo Section */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-5 transform scale-125 origin-center lg:origin-left">
                <LogoHeader title="" subtitle="" /> 
            </div>
            
            
            <p className="mb-16 text-sm text-slate-500">
              Join <span className="text-[#ff5701] font-bold">Shopy</span> and start managing your store.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold leading-6 text-left text-slate-900">
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#ff5701] sm:text-sm sm:leading-6 transition-all"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-left text-slate-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#ff5701] sm:text-sm sm:leading-6 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold leading-6 text-left text-slate-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#ff5701] sm:text-sm sm:leading-6 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-semibold leading-6 text-left text-slate-900">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${
                        password && confirmPassword && password !== confirmPassword 
                        ? 'ring-red-300 focus:ring-red-500' 
                        : 'ring-slate-300 focus:ring-[#ff5701]'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                 {password && confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-500 font-medium text-right">Passwords do not match</p>
                 )}
              </div>

              {/* Error Alert */}
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              {/* Submit Button - Orange Theme */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center rounded-lg bg-[#ff5701] px-3 py-3 text-sm font-bold leading-6 text-white shadow-md hover:bg-[#e64e00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5701] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-[#ff5701] hover:text-[#e64e00]">
                    Log in
                    </Link>
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Image with Orange Overlay */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2070&auto=format&fit=crop"
          alt="E-commerce shopping"
        />
        {/* Overlay matches the Shopy Admin color palette */}
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply transition-colors hover:bg-blue-900/30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-20 text-white z-10">
            <h3 className="text-4xl font-extrabold leading-tight">
                Empower your business.
            </h3>
            <p className="mt-4 text-xl text-orange-50 opacity-90">
                Join thousands of store owners today.
            </p>
        </div>
      </div>
    </div>
  );
}