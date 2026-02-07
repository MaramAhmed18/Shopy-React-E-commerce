// src/pages/auth/Signup.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase.js';
import LogoHeader from '../../components/common/LogoHeader.jsx';
import { Loader2, ArrowRight } from 'lucide-react';
import { useFormik } from 'formik'; //
import * as Yup from 'yup'; //

export default function Signup() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Formik Initialization
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Full name is required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required')
    }),
    onSubmit: async (values) => {
      setError('');
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          username: values.username,
          email: values.email,
          role: 'user',
          createdAt: new Date().toISOString()
        });
        navigate('/login');
      } catch (error) {
        let msg = "Failed to create account.";
        if (error.code === 'auth/email-already-in-use') msg = "This email is already in use.";
        setError(msg);
      } finally {
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
              Join <span className="text-[#ff5701] font-bold">Shopy</span> and start managing your store.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold leading-6 text-left text-slate-900">Full Name</label>
                <div className="mt-2">
                  <input
                    {...formik.getFieldProps('username')}
                    className={`block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm transition-all ${
                      formik.touched.username && formik.errors.username ? 'ring-red-300' : 'ring-slate-300 focus:ring-[#ff5701]'
                    }`}
                    placeholder="Jane Doe"
                  />
                  {formik.touched.username && formik.errors.username && <p className="text-red-500 text-xs mt-1 font-bold">{formik.errors.username}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold leading-6 text-left text-slate-900">Email address</label>
                <div className="mt-2">
                  <input
                    type="email"
                    {...formik.getFieldProps('email')}
                    className={`block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm transition-all ${
                      formik.touched.email && formik.errors.email ? 'ring-red-300' : 'ring-slate-300 focus:ring-[#ff5701]'
                    }`}
                    placeholder="you@example.com"
                  />
                  {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{formik.errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold leading-6 text-left text-slate-900">Password</label>
                <div className="mt-2">
                  <input
                    type="password"
                    {...formik.getFieldProps('password')}
                    className={`block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm transition-all ${
                      formik.touched.password && formik.errors.password ? 'ring-red-300' : 'ring-slate-300 focus:ring-[#ff5701]'
                    }`}
                    placeholder="••••••••"
                  />
                  {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{formik.errors.password}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold leading-6 text-left text-slate-900">Confirm Password</label>
                <div className="mt-2">
                  <input
                    type="password"
                    {...formik.getFieldProps('confirmPassword')}
                    className={`block w-full rounded-lg border-0 py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm transition-all ${
                        formik.touched.confirmPassword && formik.errors.confirmPassword 
                        ? 'ring-red-300 focus:ring-red-500' 
                        : 'ring-slate-300 focus:ring-[#ff5701]'
                    }`}
                    placeholder="••••••••"
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500 font-bold text-right">{formik.errors.confirmPassword}</p>
                 )}
                </div>
              </div>

              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}

              <div>
                <button type="submit" disabled={loading} className="flex w-full justify-center items-center rounded-lg bg-[#ff5701] px-3 py-3 text-sm font-bold text-white shadow-md hover:bg-[#e64e00] transition-all group disabled:opacity-70">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <>Create Account <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
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

      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2070&auto=format&fit=crop"
          alt="E-commerce shopping"
        />
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