// src/components/client/NewArrivals.jsx
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase.js"; //
import ProductCard from "./ProductCard.jsx";
import { Loader2, Sparkles } from "lucide-react";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        // Query to get the latest 4 products based on createdAt field
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        
        const querySnapshot = await getDocs(q);
        const latestProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProducts(latestProducts);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) return null; // Or a small skeleton loader

  if (products.length === 0) return null;

  return (
    <section className="px-4 sm:px-8 mt-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2">
             <Sparkles className="text-[#ff5701] w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff5701]">Just Landed</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Arrivals</h2>
        </div>
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}