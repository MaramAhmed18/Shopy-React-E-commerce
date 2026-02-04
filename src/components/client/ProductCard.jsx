// src/components/client/ProductCard.jsx
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const isOutOfStock = product.stock === 'Out of Stock';

  return (
    <Link to={`/product/${product.id}`}>
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={product.image} // Correctly mapped to DB 'image' field
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.oldPrice && product.price && (
            <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </span>
        )}
      </div>

      <div className="p-4 text-left">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{product.category}</p>
        <h3 className="mt-1 font-bold text-slate-900 group-hover:text-[#ff5701] transition-colors truncate">
          {product.name}
        </h3>
        
        <div className="flex items-center mt-2 gap-1 text-[#ff5701]">
          <Star className="w-3 h-3 fill-current" />
          <span className="text-xs font-bold text-slate-700">4.8</span>
          <span className="text-xs text-slate-400 font-normal">(124)</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-slate-900">${product.price}</span>
            {product.oldPrice && (
              <span className="ml-2 text-sm text-slate-400 line-through">${product.oldPrice}</span>
            )}
          </div>
        </div>

        <button 
          disabled={isOutOfStock}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all ${
            isOutOfStock ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#ff5701] text-white hover:bg-[#e64e00] shadow-md'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
        </button>
      </div>
    </div>

    </Link>
  );
}