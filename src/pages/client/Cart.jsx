// src/pages/client/Cart.jsx
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import Footer from "../../components/layout/Footer";

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, subtotal, tax, total } = useCart();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
                >
                    <ArrowLeft size={18} /> Continue Shopping
                </button>

                <h1 className="text-3xl font-black text-slate-900 mb-10 text-left">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <ShoppingBag className="mx-auto text-slate-200 mb-4" size={64} />
                        <p className="text-slate-500 font-bold text-xl">Your cart is empty</p>
                        <button onClick={() => navigate("/home")} className="mt-6 text-[#ff5701] font-black hover:underline">Start Shopping</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                        {/* Left: Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-6 shadow-sm group">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between text-left">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
                                                <p className="text-[#ff5701] font-bold mt-1">${item.price}</p>
                                            </div>
                                            <span className="font-black text-slate-900 text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-slate-50 text-slate-500"><Minus size={16} /></button>
                                                <span className="px-4 font-bold min-w-10 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-slate-50 text-slate-500"><Plus size={16} /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-colors">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: Order Summary */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-32">
                            <h2 className="text-xl font-black text-slate-900 mb-8 text-left">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-bold uppercase text-xs tracking-widest">Free</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Tax</span>
                                    <span className="text-slate-900 font-bold">${tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex justify-between">
                                    <span className="text-lg font-black text-slate-900">Total</span>
                                    <span className="text-2xl font-black text-[#ff5701]">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={() => navigate('/checkout')} className="w-full bg-[#ff5701] text-white py-4 rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-[#e64e00] transition-all active:scale-95 mb-4">
                                Proceed to Checkout
                            </button>
                            <button onClick={() => navigate("/home")} className="w-full py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}