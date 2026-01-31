import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package, Users, DollarSign, ShoppingBag, TrendingUp, Archive } from 'lucide-react';
import { Product, Invoice } from '../types';
import { ProductModal } from '../components/ProductModal';

interface AdminProps {
  products: Product[];
  invoices: Invoice[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ products, invoices, onAddProduct, onEditProduct, onDeleteProduct }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Statistics Calculation
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalOrders = invoices.length;
  const totalClients = new Set(invoices.map(i => i.customerEmail)).size;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Chart Data Preparation (Mocked/Simplified for demo)
  const revenueData = [4500, 3200, 6800, 5400, 8100, 7200, 9500, 8800, 10600];
  const maxRev = Math.max(...revenueData);
  const points = revenueData.map((val, i) => `${(i / (revenueData.length - 1)) * 100},${100 - (val / maxRev) * 100}`).join(' ');

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleSave = (product: Product) => {
    if (editingProduct) {
      onEditProduct(product);
    } else {
      onAddProduct(product);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Overview of store performance and inventory.</p>
        </div>
        
        <div className="flex bg-zinc-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'products' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Inventory
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Quick Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex flex-col justify-between h-40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mb-4 relative z-10">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-zinc-500 text-sm font-medium relative z-10">Total Clients</p>
                <h3 className="text-2xl font-bold text-zinc-900 mt-1 relative z-10">{totalClients}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex flex-col justify-between h-40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 relative z-10">
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="text-zinc-500 text-sm font-medium relative z-10">Total Revenue</p>
                <h3 className="text-2xl font-bold text-zinc-900 mt-1 relative z-10">${totalRevenue.toFixed(2)}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex flex-col justify-between h-40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4 relative z-10">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="text-zinc-500 text-sm font-medium relative z-10">Total Orders</p>
                <h3 className="text-2xl font-bold text-zinc-900 mt-1 relative z-10">{totalOrders}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex flex-col justify-between h-40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4 relative z-10">
                  <Package className="w-5 h-5" />
                </div>
                <p className="text-zinc-500 text-sm font-medium relative z-10">Total Products</p>
                <h3 className="text-2xl font-bold text-zinc-900 mt-1 relative z-10">{products.length}</h3>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-1">Total Revenue</h3>
                <h2 className="text-3xl font-bold mb-6">${totalRevenue.toFixed(2)}</h2>
                <div className="h-48 w-full">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.5)', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M0,100 ${points.split(' ').map((p, i) => `L${p.split(',')[0]},${p.split(',')[1]}`).join(' ')} L100,100 Z`}
                      fill="url(#grad1)"
                    />
                    <polyline
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      points={points}
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Dots */}
                    {points.split(' ').map((p, i) => (
                      <circle key={i} cx={p.split(',')[0]} cy={p.split(',')[1]} r="1.5" fill="white" />
                    ))}
                  </svg>
                </div>
                <div className="flex justify-between text-xs text-indigo-200 mt-4 font-medium uppercase tracking-wider">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span>
                </div>
              </div>
            </div>

            {/* Earnings / Categories Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex flex-col">
               <h3 className="text-lg font-bold text-zinc-900 mb-6">Sales Distribution</h3>
               <div className="flex-1 flex items-center justify-center relative">
                  <svg viewBox="0 0 36 36" className="w-48 h-48 transform -rotate-90">
                    {/* Ring Background */}
                    <path
                      className="text-zinc-100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.8"
                    />
                    {/* Ring Progress (67%) */}
                    <path
                      className="text-red-500 drop-shadow-md"
                      strokeDasharray="67, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-zinc-900">67%</span>
                    <span className="text-xs text-zinc-500 uppercase tracking-wide">Growth</span>
                  </div>
               </div>
               <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                      <span className="text-zinc-600">Retail Sales</span>
                    </div>
                    <span className="font-bold text-zinc-900">$18,756</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-zinc-200 mr-2" />
                      <span className="text-zinc-600">Returns</span>
                    </div>
                    <span className="font-bold text-zinc-900">$1,599</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        /* PRODUCTS TABLE TAB */
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
            <h2 className="font-semibold text-zinc-900">Product List</h2>
            <button
              onClick={handleAddClick}
              className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={product.image} 
                          alt="" 
                          className="h-10 w-10 rounded-lg object-cover bg-zinc-100 mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-zinc-900">{product.name}</div>
                          <div className="text-xs text-zinc-500 line-clamp-1 max-w-[200px]">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 font-medium">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      No products found. Add some to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
};