// src/components/client/Hero.jsx
export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#ff5701] to-[#ff2e00] rounded-3xl mx-4 sm:mx-8 my-6">
      <div className="relative z-10 px-6 py-12 sm:px-16 sm:py-24 max-w-2xl text-left">
        <h1 className="text-3xl sm:text-5xl font-black text-white ">
          Shop the Latest Trends
        </h1>
        <p className="mt-6 text-md text-orange-50 opacity-90 ">
          Discover amazing products at unbeatable prices. Free shipping on orders over $50!
        </p>
        <button className="mt-10 bg-white text-[#ff5701] px-8 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-xl">
          Shop Now
        </button>
      </div>
      
      {/* Decorative background shape */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 skew-x-12 translate-x-1/3" />
    </div>
  );
}