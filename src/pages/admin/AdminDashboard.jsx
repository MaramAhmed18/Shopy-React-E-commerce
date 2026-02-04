// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { getAllDocs } from "../../utils/firebaseHelper";
import Navbar from "../../components/layout/Navbar";
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [orders, products, users] = await Promise.all([
        getAllDocs("orders"),
        getAllDocs("products"),
        getAllDocs("users")
      ]);
      
      setStats({
        revenue: orders.reduce((acc, curr) => acc + (curr.total || 0), 0),
        orders: orders.length,
        products: products.length,
        users: users.length
      });
      setRecentOrders(orders.slice(0, 5));
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-end mb-12">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <div className="flex gap-4">
            <Link to="/admin/products" className="bg-slate-50 text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Manage Products</Link>
            <Link to="/admin/orders" className="bg-[#ff5701] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#e64e00] transition-all">View Orders</Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8 mb-16">
          <StatCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<DollarSign className="text-emerald-500" />} trend="+12.5%" isUp={true} />
          <StatCard title="Total Orders" value={stats.orders} icon={<ShoppingBag className="text-orange-500" />} trend="+8.2%" isUp={true} />
          <StatCard title="Total Products" value={stats.products} icon={<Package className="text-purple-500" />} trend="+3.1%" isUp={true} />
          <StatCard title="Total Customers" value={stats.users} icon={<Users className="text-rose-500" />} trend="-2.4%" isUp={false} />
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black text-slate-900">Recent Orders</h2>
            <Link to="/admin/orders" className="bg-slate-50 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">View All</Link>
          </div>
          <OrderMiniTable orders={recentOrders} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isUp }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 flex flex-col items-start shadow-sm">
      <div className="flex justify-between w-full mb-8">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        <div className={`flex items-center gap-1 text-[11px] font-black ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />} {trend}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}

function OrderMiniTable({ orders }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
          <th className="pb-5">Order ID</th>
          <th className="pb-5">Customer</th>
          <th className="pb-5">Amount</th>
          <th className="pb-5 text-right">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {orders.map(order => (
          <tr key={order.id} className="text-sm">
            <td className="py-6 font-black text-slate-900">#{order.orderNumber}</td>
            <td className="py-6 text-slate-600 font-bold">{order.contact?.name || 'Guest'}</td>
            <td className="py-6 font-black text-slate-900">${order.total?.toFixed(2)}</td>
            <td className="py-6 text-right">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{order.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}