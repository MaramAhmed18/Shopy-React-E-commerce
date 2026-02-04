// src/components/client/OurProducts.jsx
import { useEffect, useState } from "react";
import { getAllDocs } from "../../utils/firebaseHelper.js";
import ProductCard from "./ProductCard.jsx";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react"; // Added pagination icons

export default function OurProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All", "Clothing", "Footwear", "Accessories", "Electronics"]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // NEW: Pagination State
  const [currentPage, setCurrentPage] = useState(1); // Initializing pagination state
  const itemsPerPage = 4; // Number of products to show per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getAllDocs("products");
        setProducts(productsData);

        const categoriesData = await getAllDocs("categories");
        if (categoriesData && categoriesData.length > 0) {
          const names = categoriesData.map(c => c.name);
          setCategories(["All", ...names]);
        }
      } catch (err) {
        console.error("Firebase Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // NEW: Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#ff5701]" />
        <p className="mt-4 text-slate-500 font-medium">Syncing Shopy Collection...</p>
      </div>
    );
  }

  return (
    <section className="px-4 sm:px-8 mt-24 max-w-7xl mx-auto pb-10">
      <div className="text-left mb-8">
        <h2 className="text-3xl font-black text-slate-900">Our Products</h2>
        <p className="text-slate-500 mt-2 font-medium">Handpicked items just for you</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar max-w-full">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 shadow-sm ${selectedCategory === cat
                ? 'bg-[#ff5701] text-white shadow-lg shadow-[#ff5701]/20 scale-105 border-0'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-6 mb-12">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#ff5701] transition-colors" />
          <input
            type="text"
            placeholder="Search our collection..."
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#ff5701] outline-none text-sm font-semibold shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">No products found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Display only the current page's products */}
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/*  Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center gap-6">
              

              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => p - 1);
                    window.scrollTo({ top: 1100, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-2xl border border-slate-100 bg-white shadow-sm disabled:opacity-20 hover:border-[#ff5701] hover:text-[#ff5701] transition-all group"
                >
                  <ChevronLeft size={20} className="group-active:scale-75 transition-transform" />
                </button>

                {/* Page Number Buttons */}
                <div className="hidden sm:flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Logic to show limited pages if totalPages is high
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 1100, behavior: 'smooth' });
                          }}
                          className={`w-8 h-8 rounded-2xl font-black text-xs transition-all ${currentPage === pageNum
                              ? "bg-[#ff5701] text-white shadow-lg shadow-orange-100 scale-110"
                              : "bg-white border border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    // Add ellipses for hidden pages
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="text-slate-300 font-bold px-1">...</span>;
                    }
                    return null;
                  })}
                </div>

                {/* Next Button */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => p + 1);
                    window.scrollTo({ top: 1100, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-2xl border border-slate-100 bg-white shadow-sm disabled:opacity-20 hover:border-[#ff5701] hover:text-[#ff5701] transition-all group"
                >
                  <ChevronRight size={20} className="group-active:scale-75 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}