// src/pages/admin/ProductManagement.jsx
import { useState, useEffect, useMemo } from "react";
import { getAllDocs, deleteDocById } from "../../utils/firebaseHelper";
import Navbar from "../../components/layout/Navbar";
import { Plus, Edit3, Trash2, ArrowLeft, Search, ChevronLeft, ChevronRight, Filter, AlertTriangle, X } from "lucide-react";
import { Link } from "react-router-dom";
import AddProductForm from "../../components/admin/AddProductForm";
import EditProductForm from "../../components/admin/EditProductForm";
import NotificationBadge from "../../components/common/NotificationBadge"; //

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null); //
  const [notification, setNotification] = useState(null); //
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchProducts = async () => {
    const data = await getAllDocs("products");
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  // Combined Search and Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Replaced window.confirm with custom modal logic
  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteDocById("products", productToDelete.id);
      setNotification({ type: "success", message: "Product deleted successfully!" }); //
      fetchProducts(); 
    } catch (err) {
      setNotification({ type: "error", message: "Failed to delete product." }); //
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      {/* Non-blocking feedback */}
      {notification && (
        <NotificationBadge 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      <main className="max-w-7xl mx-auto px-8 py-12 text-left">
        <Link to="/admin" className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-10 hover:text-slate-900 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Products</h1>
            <p className="text-slate-400 font-medium mt-2">Manage your store inventory and details.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="bg-[#ff5701] text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-[#e64e00] transition-all flex items-center gap-3 shadow-lg shadow-orange-100"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" placeholder="Search by product name..." value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#ff5701] outline-none shadow-sm" 
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <select 
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#ff5701] outline-none shadow-sm appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Clothing">Clothing</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-10 py-6">Product Details</th>
                <th className="px-10 py-6">Description</th>
                <th className="px-10 py-6 text-center">Category</th>
                <th className="px-10 py-6 text-center">Price</th>
                <th className="px-10 py-6 text-center">Stock</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedItems.length > 0 ? paginatedItems.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-10 py-8 flex items-center gap-6">
                    <img src={product.image} className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm" alt="" />
                    <div>
                        <p className="font-black text-slate-900 text-sm">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {product.id.slice(0,8)}</p>
                    </div>
                  </td>
                  
                  <td className="px-10 py-8 max-w-[250px]">
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {product.description || "No description provided."}
                    </p>
                  </td>

                  <td className="px-10 py-8 text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase bg-slate-50 px-3 py-1 rounded-lg">{product.category}</span>
                  </td>
                  <td className="px-10 py-8 font-black text-slate-900 text-center">
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${product.stock === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {product.stock}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right space-x-2">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="text-slate-300 hover:text-slate-900 transition-colors"
                    >
                      <Edit3 size={18}/>
                    </button>
                    <button 
                      onClick={() => setProductToDelete(product)} //
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-slate-400 font-bold text-sm">No products found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-10 py-6 flex items-center justify-between border-t border-slate-50 bg-slate-50/20">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {paginatedItems.length} of {filteredProducts.length} Items</p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border border-slate-100 bg-white rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-colors"><ChevronLeft size={16}/></button>
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border border-slate-100 bg-white rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-colors"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300 text-center">
            <button onClick={() => setProductToDelete(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle className="text-rose-500" size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Remove Product?</h2>
            <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8 uppercase tracking-widest px-4">
              Delete <span className="text-slate-900">"{productToDelete.name}"</span>? 
            </p>
            <div className="flex w-full gap-4">
              <button onClick={() => setProductToDelete(null)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddProductForm 
          onClose={() => setShowAddModal(false)} 
          onRefresh={fetchProducts} 
        />
      )}
      
      {editingProduct && (
        <EditProductForm 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onRefresh={fetchProducts} 
        />
      )}
    </div>
  );
}