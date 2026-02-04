// src/components/admin/AddProductForm.jsx
import { useState } from "react";
import { uploadProductImage } from "../../utils/supabaseHelper"; 
import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { X, Loader2, UploadCloud } from "lucide-react";
import NotificationBadge from "../common/NotificationBadge"; //

export default function AddProductForm({ onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); //
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [formData, setFormData] = useState({
    name: "", 
    price: "", 
    category: "Clothing", 
    stock: "In Stock", 
    description: "" 
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
        setNotification({ type: "warning", message: "Please select an image first." }); //
        return;
    }
    
    setLoading(true);
    try {
      const imageUrl = await uploadProductImage(imageFile);

      await addDoc(collection(db, "products"), {
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price),
        rating: 4.5, 
        createdAt: new Date().toISOString()
      });
      
      onRefresh(); //
      onClose(); 
    } catch (err) {
      console.error("Upload failed:", err);
      setNotification({ type: "error", message: "Upload failed. Check Supabase bucket settings." }); //
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      {notification && (
        <NotificationBadge 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Add New Product</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Inventory Management</p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
            <input 
              required 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#ff5701] outline-none transition-all" 
              placeholder="e.g. Urban Denim Jacket"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              required 
              rows="3"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#ff5701] outline-none transition-all resize-none" 
              placeholder="Briefly describe the product features..."
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price ($)</label>
              <input 
                required type="number" step="0.01"
                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none cursor-pointer"
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Clothing">Clothing</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Availability Status</label>
            <select 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none cursor-pointer"
              value={formData.stock} 
              onChange={e => setFormData({...formData, stock: e.target.value})}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Image</label>
            <div className="relative group">
              <input 
                required type="file" accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className={`w-full p-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all ${previewUrl ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50 group-hover:border-[#ff5701]'}`}>
                {previewUrl ? (
                  <img src={previewUrl} className="w-20 h-20 object-cover rounded-xl shadow-md mb-2" alt="Preview" />
                ) : (
                  <UploadCloud className="text-slate-300 mb-2 group-hover:text-[#ff5701] transition-colors" size={32} />
                )}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {imageFile ? imageFile.name : "Click to select image"}
                </p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-5 bg-[#ff5701] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#e64e00] transition-all shadow-xl shadow-orange-100 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : "Publish to Store"}
          </button>
        </form>
      </div>
    </div>
  );
}