// src/pages/admin/OrderManagement.jsx
import { useState, useEffect, useMemo } from "react";
import { getAllDocs, updateDocById } from "../../utils/firebaseHelper";
import Navbar from "../../components/layout/Navbar";
import { Eye, ArrowLeft, Search, Filter, ChevronLeft, ChevronRight, X, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Orders");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null); // For Status Modal
    const itemsPerPage = 5;

    const fetchOrders = () => getAllDocs("orders").then(setOrders);
    useEffect(() => { fetchOrders(); }, []);

    // 1. Search and Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "All Orders" || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    // 2. Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleUpdateStatus = async (newStatus) => {
        try {
            // Assuming updateDocById is in your helper
            await updateDocById("orders", selectedOrder.id, { status: newStatus });
            fetchOrders();
            setSelectedOrder(null);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-8 py-12 text-left">
                <Link to="/admin" className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-10 hover:text-slate-900 transition-colors">
                    <ArrowLeft size={14} /> Back to Dashboard
                </Link>
                <h1 className="text-4xl font-black text-slate-900 mb-12">Order Management</h1>

                {/* Search & Filter Bar */}
                <div className="flex gap-4 mb-10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID or Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#ff5701] outline-none shadow-sm transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white px-8 border border-slate-100 rounded-2xl font-black text-xs text-slate-900 shadow-sm outline-none cursor-pointer"
                    >
                        <option>All Orders</option>
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                    </select>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-10 py-6">Order ID</th>
                                <th className="px-10 py-6">Customer</th>
                                <th className="px-10 py-6">Date</th>
                                <th className="px-10 py-6">Items</th>
                                <th className="px-10 py-6">Amount</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedOrders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-10 py-8 font-black text-slate-900">#{order.orderNumber}</td>
                                    <td className="px-10 py-8">
                                        <p className="font-bold text-slate-900 text-sm">{order.contact?.name}</p>
                                        <p className="text-[11px] text-slate-400 font-bold">{order.contact?.email}</p>
                                    </td>
                                    <td className="px-10 py-8 text-[11px] font-bold text-slate-600">{order.createdAt?.split('T')[0]}</td>
                                    <td className="px-10 py-8 text-xs font-black text-slate-900 text-center">
                                        {/* Calculate total quantity across all items in the order */}
                                        {order.items?.reduce((acc, item) => acc + item.quantity, 0)}
                                    </td>
                                    <td className="px-10 py-8 font-black text-slate-900">${order.total?.toFixed(2)}</td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-slate-300 hover:text-[#ff5701] transition-colors p-2 hover:bg-orange-50 rounded-lg"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 3. Pagination Footer */}
                    <div className="px-10 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} records
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="p-2 rounded-xl border border-slate-100 bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="p-2 rounded-xl border border-slate-100 bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* 4. Update Status Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
                        <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={20} /></button>
                        <h2 className="text-xl font-black mb-1">Update Status</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Order #{selectedOrder.orderNumber}</p>

                        <div className="space-y-3">
                            {["Pending", "Processing", "Shipped", "Delivered"].map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleUpdateStatus(status)}
                                    className={`w-full p-4 rounded-2xl flex items-center justify-between font-bold text-sm transition-all ${selectedOrder.status === status
                                            ? 'bg-orange-50 text-[#ff5701] ring-2 ring-[#ff5701]'
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {status}
                                    {selectedOrder.status === status && <CheckCircle size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}