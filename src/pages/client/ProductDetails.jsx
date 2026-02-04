// src/pages/client/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocById } from "../../utils/firebaseHelper.js"; //
import { useCart } from "../../context/CartContext"; //
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer"; //
import { 
  Loader2, ArrowLeft, Star, Minus, Plus, ShoppingCart, 
  Heart, Share2, ShieldCheck, RotateCcw, Truck 
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getDocById("products", id)
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-[#ff5701] w-10 h-10 mb-4" />
      <p className="text-slate-400 text-sm font-medium">Loading details...</p>
    </div>
  );

  if (!product) return <div className="text-center py-20 font-bold">Product not found.</div>;

  // Logic based on Firebase string field "stock"
  const isOutOfStock = product.stock?.toLowerCase() === "out of stock";

  return (
    <div className="min-h-screen bg-white font-sans antialiased flex flex-col">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Product Image with Status Overlay */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group">
            <img 
              src={product.image} 
              alt={product.name} 
              className={`w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105 `}
            />
            {isOutOfStock ? (
              <span className="absolute top-4 left-4 bg-slate-900 text-white font-black px-3 py-1.5 rounded-md text-[10px] shadow-lg uppercase tracking-widest">
                Sold Out
              </span>
            ) : product.oldPrice && (
              <span className="absolute top-4 left-4 bg-[#ff3b30] text-white font-black px-2 py-1 rounded-md text-[10px] shadow-lg">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Right: Product Content */}
          <div className="flex flex-col text-left lg:pl-4">
            <span className="text-[#ff5701] font-bold uppercase tracking-widest text-[10px] mb-1">
              {product.category || "General"}
            </span>
            
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-[#ffcc00]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-slate-400 font-bold text-[11px]">
                4.5 <span className="font-medium opacity-70">(128 reviews)</span>
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-black text-slate-900">${product.price}</span>
              {product.oldPrice && (
                <span className="text-lg text-slate-300 line-through font-bold">${product.oldPrice}</span>
              )}
            </div>

            <p className="text-slate-500 leading-relaxed mb-6 text-sm font-medium max-w-lg">
              {product.description || "Premium quality product with exceptional craftsmanship. Designed for durability and style."}
            </p>

            {/* Dynamic Stock Badge based on String Status */}
            {isOutOfStock ? (
              <div className="inline-flex items-center bg-rose-50 text-rose-600 px-2 py-1 rounded-md text-[10px] font-black mb-8 w-fit uppercase tracking-tighter">
                 Out of Stock
              </div>
            ) : (
              <div className="inline-flex items-center bg-[#e8f5e9] text-[#2e7d32] px-2 py-1 rounded-md text-[10px] font-black mb-8 w-fit">
                In Stock 
              </div>
            )}

            {/* Quantity Selector - Interaction Locked if Out of Stock */}
            <div className={`flex items-center gap-4 mb-8 ${isOutOfStock ? 'opacity-30 pointer-events-none' : ''}`}>
              <span className="font-black text-slate-900 text-sm">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-slate-50 text-slate-400 transition-all border-r border-slate-200"
                ><Minus size={14} strokeWidth={3} /></button>
                <span className="px-5 font-black text-sm min-w-[40px] text-center text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-slate-50 text-slate-400 transition-all border-l border-slate-200"
                ><Plus size={14} strokeWidth={3} /></button>
              </div>
            </div>

            {/* Action Buttons - Logic based on stock string */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button 
                disabled={isOutOfStock}
                onClick={() => { addToCart(product, quantity); navigate('/cart'); }}
                className={`flex-1 py-3.5 rounded-xl font-black flex items-center justify-center gap-2 transition-all text-sm ${
                  isOutOfStock 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-[#ff5701] text-white hover:bg-[#e64e00] shadow-md shadow-orange-100 active:scale-95'
                }`}
              >
                <ShoppingCart size={18} strokeWidth={2.5} /> 
                {isOutOfStock ? "Sold Out" : "Add to Cart"}
              </button>
              
            </div>

            {/* Value Props */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px]">
                <Truck size={16} className="text-[#4caf50]" /> Free shipping on orders over $50
              </div>
              <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px]">
                <RotateCcw size={16} className="text-[#4caf50]" /> 30-day return policy
              </div>
              <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px]">
                <ShieldCheck size={16} className="text-[#4caf50]" /> 1-year warranty included
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}