import React, { useState, useMemo } from 'react';
import { ShoppingCart, Store, ReceiptText, Gift, Plus, Minus, Trash2, ArrowLeft, BellRing, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, Category, CartItem } from './data';

interface Voucher {
  code: string;
  amount?: number;
  percentage?: number;
  used: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'shop' | 'cart' | 'admin_notification' | 'receipt'>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  
  // Voucher states
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([
    { code: 'HELLO100', amount: 100, used: false },
    { code: 'OFF10', percentage: 10, used: false }
  ]);
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [userAddress, setUserAddress] = useState('');

  const [orderSlip, setOrderSlip] = useState<{
    items: CartItem[];
    total: number;
    subtotal: number;
    discountAmount: number;
    appliedVoucher: Voucher | null;
    wonVoucher: Voucher | null;
    address: string;
    deliveryTimeMins: number;
    date: Date;
    orderId: string;
  } | null>(null);

  const categories: (Category | 'All')[] = ['All', 'Grocery', 'Vegetables', 'Fruits'];

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.percentage) {
      return Math.floor(cartTotal * (appliedVoucher.percentage / 100));
    }
    return Math.min(cartTotal, appliedVoucher.amount || 0);
  }, [cartTotal, appliedVoucher]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartTotal - discountAmount);
  }, [cartTotal, discountAmount]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const checkout = () => {
    if (cart.length === 0) return;
    if (!userAddress.trim()) {
      alert('Please enter your delivery address.');
      return;
    }
    setActiveTab('admin_notification');
  };

  const applyVoucherCode = () => {
    const v = availableVouchers.find(x => x.code.toUpperCase() === voucherInput.toUpperCase() && !x.used);
    if (v) {
      setAppliedVoucher(v);
      setVoucherInput('');
    } else {
      alert('Invalid or already used voucher.');
    }
  };

  const acceptOrder = () => {
    // Mark voucher used if applicable
    if (appliedVoucher) {
      setAvailableVouchers(prev => prev.map(v => v.code === appliedVoucher.code ? { ...v, used: true } : v));
    }

    // Random voucher logic: 50% chance to win a voucher between 5% and 20% off
    const getsVoucher = Math.random() < 0.5;
    let wonVoucher: Voucher | null = null;
    
    if (getsVoucher) {
      const voucherPercentage = Math.floor(Math.random() * (20 - 5 + 1)) + 5; // 5 to 20
      const newVoucherCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      wonVoucher = { code: newVoucherCode, percentage: voucherPercentage, used: false };
      setAvailableVouchers(prev => [...prev, wonVoucher!]);
    }

    setOrderSlip({
      items: [...cart],
      total: finalTotal,
      subtotal: cartTotal,
      discountAmount,
      appliedVoucher,
      wonVoucher,
      address: userAddress,
      deliveryTimeMins: 10,
      date: new Date(),
      orderId: Math.random().toString(36).substring(2, 9).toUpperCase()
    });
    
    setCart([]);
    setAppliedVoucher(null);
    setUserAddress('');
    setActiveTab('receipt');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-emerald-50 text-slate-800 font-sans shadow-xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-emerald-50 px-6 py-6 pt-10 sticky top-0 z-10 pb-4">
        <div className="flex items-center justify-between shadow-sm rounded-3xl bg-white p-3 px-5 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600">
            <Store className="w-6 h-6" />
            <h1 className="font-display font-extrabold text-xl tracking-tight text-emerald-900">Mini <span className="text-orange-500 underline underline-offset-4 decoration-2">Market</span></h1>
          </div>
          {activeTab !== 'receipt' && activeTab !== 'admin_notification' && (
            <button 
              onClick={() => setActiveTab(activeTab === 'shop' ? 'cart' : 'shop')}
              className="relative p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'shop' && (
            <motion.div 
              key="shop"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              {/* Categories */}
              <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-2 pt-2 -mt-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                        : 'bg-white text-slate-600 border border-slate-100 hover:border-emerald-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 gap-5">
                {filteredProducts.map(product => (
                  <motion.div 
                    layout
                    key={product.id}
                    className="bg-white p-4 rounded-3xl border border-emerald-50 flex flex-col gap-3 group shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="h-28 bg-slate-50 group-hover:bg-emerald-50/50 rounded-2xl flex items-center justify-center text-5xl transition-colors">
                      {product.image}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-bold text-base text-slate-800 leading-tight mb-1">{product.name}</h3>
                      <p className="text-xs text-slate-400 font-medium mb-3">{product.category}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <p className="text-emerald-600 font-bold">Rs. {product.price}</p>
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-emerald-50 text-emerald-600 p-2 rounded-xl font-bold hover:bg-emerald-500 hover:text-white active:scale-95 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'cart' && (
            <motion.div 
              key="cart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col min-h-full pb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setActiveTab('shop')} className="p-2 bg-white border border-slate-100 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 rounded-xl transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-extrabold text-emerald-900">Your <span className="text-orange-500 underline underline-offset-4 decoration-2">Cart</span></h2>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-slate-400 py-20 bg-white rounded-3xl border border-emerald-50">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
                  <p className="font-medium text-slate-500">Your cart is empty.</p>
                  <button 
                    onClick={() => setActiveTab('shop')}
                    className="mt-6 py-2 px-6 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-6">
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-white p-3 rounded-3xl border border-emerald-50 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 text-3xl bg-slate-50 flex items-center justify-center rounded-2xl">
                          {item.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 leading-none mb-1.5">{item.name}</h3>
                          <p className="text-emerald-600 font-bold text-sm">Rs. {item.price}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-2 py-1 mr-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 rounded-xl text-slate-500 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all"
                          >
                            {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-orange-500" /> : <Minus className="w-4 h-4" />}
                          </button>
                          <span className="font-bold text-sm w-4 text-center text-slate-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 rounded-xl text-slate-500 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200">
                    {/* Voucher Section */}
                    <div className="mb-6 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Voucher Code (e.g. HELLO100)"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value)}
                        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none uppercase font-mono placeholder:normal-case placeholder:font-sans"
                      />
                      <button 
                        onClick={applyVoucherCode}
                        className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-emerald-200 hover:bg-emerald-600 transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="flex justify-between font-mono text-sm text-slate-500 mb-3">
                      <span>Subtotal</span>
                      <span className="text-slate-800 font-semibold">Rs. {cartTotal}</span>
                    </div>

                    {appliedVoucher && (
                      <div className="flex justify-between font-mono text-sm text-orange-500 mb-3">
                        <span className="flex items-center gap-1 mt-0.5">
                          Voucher ({appliedVoucher.code})
                          <button 
                            onClick={() => setAppliedVoucher(null)} 
                            className="bg-orange-100/50 text-orange-600 rounded-full w-4 h-4 flex items-center justify-center ml-1 pb-0.5"
                          >×</button>
                        </span>
                        <span className="font-semibold">
                          - Rs. {discountAmount} {appliedVoucher.percentage && `(${appliedVoucher.percentage}%)`}
                        </span>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Delivery Address</label>
                      <textarea 
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        placeholder="Enter your full address here..."
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-20 shadow-sm"
                      />
                    </div>

                    <div className="flex justify-between font-black text-xl text-slate-800 pt-4 border-t-2 border-slate-800 mt-2">
                      <span>TOTAL</span>
                      <span>Rs. {finalTotal}</span>
                    </div>
                    <button 
                      onClick={checkout}
                      className="w-full mt-6 py-4 bg-emerald-500 text-white font-black text-lg rounded-3xl shadow-xl shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all"
                    >
                      Wait & Place Order
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'admin_notification' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center min-h-[60vh]"
            >
              <div className="bg-slate-800 text-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-yellow-400 animate-pulse"></div>
                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BellRing className="w-10 h-10 text-orange-400 animate-bounce" />
                </div>
                <h2 className="text-2xl font-black mb-2">Incoming Order!</h2>
                <div className="bg-emerald-500/20 text-emerald-400 text-xs font-mono py-1 px-3 rounded-full inline-block border border-emerald-500/30 mb-4">
                  📱 Alert sent to: 03366832389
                </div>
                <p className="text-slate-400 text-sm mb-6">You received a new order. Please review and accept it.</p>
                
                <div className="bg-slate-900/50 rounded-2xl p-4 mb-8 text-left border border-slate-700">
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-medium">Items</span>
                    <span className="font-bold">{cartItemCount} qty</span>
                  </div>
                  {appliedVoucher && (
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                      <span className="text-slate-400 font-medium">Discount</span>
                      <span className="font-bold text-orange-400">
                        -Rs. {discountAmount} {appliedVoucher.percentage && `(${appliedVoucher.percentage}%)`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-medium">Address</span>
                    <span className="font-medium text-right max-w-[150px] truncate" title={userAddress}>{userAddress}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-400 font-medium">Revenue</span>
                    <span className="font-black text-xl text-emerald-400">Rs. {finalTotal}</span>
                  </div>
                </div>

                <button 
                  onClick={acceptOrder}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-lg py-4 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Accept & Process
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'receipt' && orderSlip && (
            <motion.div 
              key="receipt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 pb-8"
            >
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 relative">
                <div className="flex flex-col items-center gap-2 mb-6">
                  <div className="text-emerald-500 bg-white p-3 border border-emerald-100 rounded-2xl shadow-sm">
                    <ReceiptText className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Order Slip</h2>
                  <p className="text-xs text-slate-400 font-mono">#{orderSlip.orderId} - {orderSlip.date.toLocaleDateString()}</p>
                </div>

                <div className="bg-white border border-emerald-100 rounded-2xl p-4 mb-6 shadow-sm">
                  <p className="text-emerald-600 font-bold mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Order Accepted!
                  </p>
                  <p className="text-slate-600 text-sm">Delivery in approx. <span className="font-bold text-orange-500">{orderSlip.deliveryTimeMins} minutes</span></p>
                  <p className="text-slate-400 text-xs mt-2 truncate">To: {orderSlip.address}</p>
                </div>

                <div className="space-y-3 font-mono text-xs mb-6">
                  {orderSlip.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-slate-600">
                      <span className="flex-1 truncate pr-2">{item.name} ({item.quantity})</span>
                      <span className="font-semibold text-slate-800">{item.price * item.quantity}.00</span>
                    </div>
                  ))}
                  {orderSlip.discountAmount > 0 && (
                    <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between font-bold text-orange-600 text-sm">
                      <span>VOUCHER {orderSlip.appliedVoucher?.code ? `(${orderSlip.appliedVoucher.code})` : ''}</span>
                      <span>- Rs. {orderSlip.discountAmount}.00</span>
                    </div>
                  )}
                  <div className="border-t-2 border-slate-800 pt-3 mt-3 flex justify-between text-base font-black text-slate-800">
                    <span>TOTAL</span>
                    <span>Rs. {orderSlip.total}.00</span>
                  </div>
                </div>

                <div className="bg-slate-800 p-3 rounded-xl text-center mb-6 shadow-md">
                  <div className="flex justify-center gap-1.5 opacity-80 h-8 items-center">
                    <div className="w-1 h-6 bg-white"></div><div className="w-2 h-6 bg-white"></div><div className="w-1 h-6 bg-white"></div><div className="w-3 h-6 bg-white"></div><div className="w-1 h-6 bg-white"></div><div className="w-2 h-6 bg-white"></div><div className="w-1 h-6 bg-white"></div>
                  </div>
                  <p className="text-[10px] text-white/60 mt-2 uppercase tracking-widest italic font-medium">Thank you for shopping</p>
                </div>

                {orderSlip.wonVoucher && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-200 text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-20 transform rotate-12 scale-150">
                      <Gift className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-xl font-black mb-1">LUCKY VOUCHER! 🎁</h2>
                      <p className="opacity-90 text-sm font-medium mb-4">You just unlocked a surprise gift.</p>
                      <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 inline-block">
                        <span className="text-3xl font-black px-2">
                           {orderSlip.wonVoucher.percentage ? `${orderSlip.wonVoucher.percentage}% OFF` : `Rs. ${orderSlip.wonVoucher.amount} OFF`}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-orange-100 mt-4 opacity-80 uppercase tracking-widest">Code: {orderSlip.wonVoucher.code}</p>
                    </div>
                  </motion.div>
                )}

                <button 
                  onClick={() => {
                    setOrderSlip(null);
                    setActiveTab('shop');
                  }}
                  className="w-full mt-6 py-4 bg-white text-emerald-600 font-extrabold text-lg rounded-3xl shadow-sm border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all focus:ring-4 focus:ring-emerald-50"
                >
                  Start New Order
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* App Installation / OS Frame styling hint */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-white/50 backdrop-blur-sm shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pointer-events-none flex justify-center items-center">
        <div className="w-1/3 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}

