import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { Plus, Search, Minus, Trash2, CreditCard, RefreshCw } from 'lucide-react';

interface StoreProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onCheckout: () => void;
  onClearCart: () => void;
}

export const Store: React.FC<StoreProps> = ({ 
  products, 
  cart, 
  onAddToCart, 
  onRemoveFromCart, 
  onUpdateQuantity,
  onCheckout,
  onClearCart
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-zinc-50">
      {/* LEFT SIDE: Product Grid */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-zinc-200">
        {/* Search & Filter Header */}
        <div className="p-4 bg-white border-b border-zinc-200 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-zinc-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-zinc-900 text-white shadow-md' 
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => onAddToCart(product)}
                className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group flex flex-col"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{product.category}</p>
                  </div>
                  <div className="mt-2 font-bold text-indigo-600">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="h-full flex items-center justify-center text-zinc-400 flex-col">
              <Search className="w-12 h-12 mb-2 opacity-20" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Cart / Transaction */}
      <div className="w-[400px] bg-white flex flex-col h-full shadow-xl z-10">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
          <h2 className="font-bold text-zinc-900 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-zinc-500" />
            Current Bill
          </h2>
          <button 
            onClick={onClearCart}
            disabled={cart.length === 0}
            className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            Clear All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm">Scan or select items to start</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} // Use index to allow duplicate products if logic changes, though id is usually unique
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  item.quantity < 0 ? 'bg-red-50 border-red-100' : 'bg-white border-zinc-100'
                }`}
              >
                {/* Quantity Controls */}
                <div className="flex flex-col items-center space-y-1">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 hover:bg-zinc-100 rounded text-zinc-500"
                    // Disable incrementing returns to positive without complex logic, so we keep simple
                    disabled={item.quantity < 0 && item.quantity >= -1} 
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className={`text-sm font-bold ${item.quantity < 0 ? 'text-red-600' : 'text-zinc-900'}`}>
                    {Math.abs(item.quantity)}
                  </span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 hover:bg-zinc-100 rounded text-zinc-500"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-zinc-900 truncate pr-2">{item.name}</h3>
                    <span className={`text-sm font-bold whitespace-nowrap ${item.quantity < 0 ? 'text-red-600' : 'text-zinc-900'}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                     <p className={`text-xs ${item.quantity < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                        {item.quantity < 0 ? 'RETURN / EXCHANGE' : item.category}
                     </p>
                     <button 
                        onClick={() => onRemoveFromCart(item.id)}
                        className="p-1 text-zinc-300 hover:text-red-500 transition-colors"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals Section */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end pt-2 border-t border-zinc-200">
            <span className="text-zinc-900 font-bold">Total Due</span>
            <span className={`text-2xl font-extrabold ${total < 0 ? 'text-red-600' : 'text-indigo-600'}`}>
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${
              total < 0 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200' 
                : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-200'
            } disabled:opacity-50 disabled:shadow-none`}
          >
            {total < 0 ? 'Process Refund' : 'Complete Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};
