// src/components/client/account/OrdersTab.jsx
import { Loader2, MapPin, Calendar, Package, ArrowRight } from "lucide-react";

export default function OrdersTab({ orders, loading }) {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-lg font-black text-slate-900 mb-2">Order History</h2>
        <p className="text-slate-400 text-xs font-medium mb-8">
          Track your recent purchases
        </p>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-100 rounded-3xl">
          <Loader2 className="w-8 h-8 animate-spin text-slate-200 mb-4" />
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Syncing History...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-100 rounded-3xl text-slate-400 text-sm font-bold">
          No orders placed yet.
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map(order => (
            <div key={order.id} className="group bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-all duration-300 overflow-hidden">
              
              {/* Header: Status & Quick Info */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex gap-6">
                  <div>
                    <span className="text-[9px] font-black text-slate-300 uppercase block mb-0.5 tracking-tighter">Reference</span>
                    <p className="font-bold text-xs text-slate-900 tracking-tight">{order.orderNumber}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-300 uppercase block mb-0.5 tracking-tighter">Date</span>
                    <p className="font-bold text-xs text-slate-600">{order.createdAt?.split('T')[0]}</p>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {order.status}
                </div>
              </div>

              {/* Body: Clean Product Strip */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items?.map((item, idx) => (
                      <img 
                        key={idx}
                        src={item.image} 
                        className="w-12 h-12 rounded-xl object-cover ring-4 ring-white shadow-sm transition-transform group-hover:-translate-y-1" 
                        alt="Product" 
                      />
                    ))}
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[9px] font-black text-slate-300 uppercase block tracking-tighter">Grand Total</span>
                    <p className="font-black text-lg text-slate-900 tracking-tight">${order.total?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Footer: Simple Location Label */}
              <div className="px-6 py-3 bg-slate-50/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={12} />
                  <span className="text-[10px] font-bold">Shipped to {order.shipping?.city}</span>
                </div>
                
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}