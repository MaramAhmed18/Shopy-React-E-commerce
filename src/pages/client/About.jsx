// src/pages/client/About.jsx
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { ShoppingBag, ShieldCheck, Truck, Zap } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Products", value: "500+" },
    { label: "Happy Clients", value: "10k+" },
    { label: "Cities", value: "20+" },
  ];

  const features = [
    { 
      icon: <ShieldCheck className="text-[#ff5701]" size={24} />, 
      title: "Secure Shopping", 
      desc: "Your data is protected by industry-leading encryption." 
    },
    { 
      icon: <Truck className="text-[#ff5701]" size={24} />, 
      title: "Fast Delivery", 
      desc: "Free shipping on all orders over $50 across the country." 
    },
    { 
      icon: <Zap className="text-[#ff5701]" size={24} />, 
      title: "Premium Quality", 
      desc: "We source only the best materials for our collection." 
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-slate-50 py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6 border border-slate-100">
              <ShoppingBag size={16} className="text-[#ff5701]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Since 2024</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Redefining Modern <span className="text-[#ff5701]">Streetwear.</span></h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Shopy isn't just a store; it's a movement. We believe that fashion should be accessible, sustainable, and bold. Our mission is to provide high-quality apparel that empowers your everyday style.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-5xl mx-auto px-4 -mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
                <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div key={i} className="text-left group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-50 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-black text-lg text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}