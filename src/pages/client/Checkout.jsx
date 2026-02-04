// src/pages/client/Checkout.jsx
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../utils/firebaseHelper";
import Navbar from "../../components/layout/Navbar";
import PayPalButton from "../../components/client/checkout/PayPalButton"; 
import { 
  ArrowLeft, Mail, Phone, User, MapPin, CheckCircle2, CreditCard, Banknote, Lock 
} from "lucide-react";
import Footer from "../../components/layout/Footer";

export default function Checkout() {
  const { cartItems, total, subtotal, tax, clearCart } = useCart(); //
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cash"); 
  const [isSuccess, setIsSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: user?.email || "", 
      phone: "", 
      firstName: "", 
      lastName: "",
      address: "", 
      city: "", 
      zipCode: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string().required("Required"),
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      zipCode: Yup.string().required("Required"),
    }),
    onSubmit: async () => {
      if (paymentMethod === "cash") {
        await processOrder("Cash on Delivery");
      }
    },
  });

  const processOrder = async (method, paypalId = null) => {
    try {
      const orderPayload = {
        orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: user.uid,
        items: cartItems,
        subtotal, 
        tax, 
        total,
        status: "Processing",
        paymentMethod: method,
        paypalTransactionId: paypalId,
        contact: {
          email: formik.values.email,
          phone: formik.values.phone,
          name: `${formik.values.firstName} ${formik.values.lastName}`
        },
        shipping: {
          address: formik.values.address,
          city: formik.values.city,
          zip: formik.values.zipCode
        }
      };

      // 1. Save to Firebase
      await createOrder(orderPayload);
      
      // 2. Clear the cart state and localStorage
      if (clearCart) {
        clearCart();
      }
      
      setIsSuccess(true);
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  const FormField = ({ name, placeholder, icon: Icon }) => (
    <div className="w-full text-left">
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input
          {...formik.getFieldProps(name)}
          placeholder={placeholder}
          className={`w-full p-4 ${Icon ? 'pl-12' : 'pl-4'} bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#ff5701] outline-none transition-all shadow-sm`}
        />
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-[10px] mt-1 ml-4 uppercase font-black">{formik.errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <button onClick={() => navigate("/cart")} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold mb-8 text-xs uppercase tracking-widest transition-colors">
          <ArrowLeft size={14} /> Back to Cart
        </button>
        <h1 className="text-3xl font-black text-slate-900 mb-10 text-left tracking-tight">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-left">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField name="firstName" placeholder="First Name" icon={User} />
                <FormField name="lastName" placeholder="Last Name" icon={User} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField name="email" placeholder="Email" icon={Mail} />
                <FormField name="phone" placeholder="Phone" icon={Phone} />
              </div>
              <FormField name="address" placeholder="Address" icon={MapPin} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField name="city" placeholder="City" />
                <FormField name="zipCode" placeholder="ZIP Code" />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-left">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'border-[#ff5701] bg-orange-50 text-[#ff5701]' : 'border-slate-100 text-slate-400'}`}
                >
                  <Banknote size={24} /> <span className="font-black text-[10px] uppercase">Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'online' ? 'border-[#ff5701] bg-orange-50 text-[#ff5701]' : 'border-slate-100 text-slate-400'}`}
                >
                  <CreditCard size={24} /> <span className="font-black text-[10px] uppercase">Online (PayPal)</span>
                </button>
              </div>

              {paymentMethod === "online" ? (
                <div className="relative min-h-[150px]">
                  {(!formik.isValid || !formik.dirty) && (
                    <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-100">
                       <Lock className="text-slate-300 mb-2" size={24} />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                          Please complete shipping details<br/>to unlock PayPal payment
                       </p>
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    <PayPalButton total={total} onSuccess={(details) => processOrder("PayPal Online", details.id)} />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={formik.handleSubmit}
                  disabled={!formik.isValid || !formik.dirty}
                  className="w-full py-5 mt-4 bg-[#ff5701] text-white rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-[#e64e00] transition-all uppercase text-[10px] tracking-widest disabled:opacity-50"
                >
                  Place Cash Order
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-fit sticky top-32">
            <h2 className="text-xl font-black mb-8 text-left uppercase text-[10px] text-slate-400 tracking-[0.2em]">Order Summary</h2>
            <div className="space-y-4 mb-8 text-left">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover border border-slate-100" alt={item.name} />
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight mb-1">{item.name}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                    <p className="font-black text-[#ff5701] text-sm">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-slate-50 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-slate-500 font-bold"><span>Subtotal</span><span className="text-slate-900 font-black">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-slate-500 font-bold"><span>Tax</span><span className="text-slate-900 font-black">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t border-slate-100">
                <span className="text-slate-900">Total</span>
                <span className="text-[#ff5701]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in border border-slate-100">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Order Confirmed!</h2>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">
               Success! Your sneakers are on the way. View status in your account.
            </p>
            <div className="space-y-3">
              <button onClick={() => navigate("/account")} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg uppercase text-[10px] tracking-[0.2em]">View My Orders</button>
              <button onClick={() => navigate("/home")} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">Return to Shop</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}