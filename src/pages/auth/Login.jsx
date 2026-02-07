// src/pages/auth/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase.js';
import { useAuth } from '../../context/AuthContext';
import LogoHeader from '../../components/common/LogoHeader.jsx';
import { Loader2, ArrowRight } from 'lucide-react';
import { useFormik } from 'formik'; //
import * as Yup from 'yup'; //

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  // Formik Initialization
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required')
    }),
    onSubmit: async (values) => {
      setError('');
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } catch (error) {
        setError('Incorrect email or password.');
        setLoading(false);
      }
    }
  });

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white w-full lg:w-[45%]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-5 transform scale-125 origin-center lg:origin-left">
              <LogoHeader title="" subtitle="" />
            </div>
            <p className="mb-16 text-sm text-slate-500">
              Sign in to manage your <span className="text-[#ff5701] font-bold">Shopy</span> store.
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold leading-6 text-left text-slate-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    {...formik.getFieldProps('email')}
                    className={`block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${
                      formik.touched.email && formik.errors.email ? 'ring-red-300' : 'ring-slate-300 focus:ring-[#ff5701]'
                    }`}
                    placeholder="admin@shopy.com"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-xs mt-1 font-bold">{formik.errors.email}</div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold leading-6 text-slate-900">
                    Password
                  </label>
                  <Link to="/forgot-password" size={16} className="text-sm font-medium text-[#ff5701] hover:text-[#e64e00]">
                    Forgot password?
                  </Link>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    {...formik.getFieldProps('password')}
                    className={`block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${
                      formik.touched.password && formik.errors.password ? 'ring-red-300' : 'ring-slate-300 focus:ring-[#ff5701]'
                    }`}
                    placeholder="••••••••"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-xs mt-1 font-bold">{formik.errors.password}</div>
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100 animate-pulse">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center rounded-lg bg-[#ff5701] px-3 py-3 text-sm font-bold leading-6 text-white shadow-md hover:bg-[#e64e00] transition-all duration-200 disabled:opacity-70 group"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-[#ff5701] hover:text-[#e64e00]">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden flex-1 lg:block bg-slate-100">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
          alt="Retail Storefront"
        />
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply transition-colors hover:bg-blue-900/30"></div>
        <div className="absolute inset-0 flex items-end p-20 text-white z-10">
          <div>
            <h3 className="text-4xl font-extrabold leading-tight">
              "Management made simple."
            </h3>
            <p className="mt-4 text-xl text-orange-50 opacity-90">
              Track products, manage stock, and grow your sales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}