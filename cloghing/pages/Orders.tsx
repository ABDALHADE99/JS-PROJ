import React, { useState } from 'react';
import { Invoice, CartItem } from '../types';
import { Search, RefreshCw, Eye, ArrowRight } from 'lucide-react';

interface OrdersProps {
  invoices: Invoice[];
  onExchange: (invoice: Invoice, itemsToReturn: CartItem[]) => void;
  onViewInvoice: (id: string) => void;
}

export const Orders: React.FC<OrdersProps> = ({ invoices, onExchange, onViewInvoice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [returnQuantities, setReturnQuantities] = useState<Record<string, number>>({});

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleReturnClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    // Initialize return quantities to 0
    const initialQty: Record<string, number> = {};
    invoice.items.forEach(item => {
      // Only allow returning positive quantity items
      if (item.quantity > 0) {
        initialQty[item.id] = 0;
      }
    });
    setReturnQuantities(initialQty);
  };

  const handleQuantityChange = (itemId: string, max: number, value: number) => {
    setReturnQuantities(prev => ({
      ...prev,
      [itemId]: Math.min(Math.max(0, value), max)
    }));
  };

  const submitExchange = () => {
    if (!selectedInvoice) return;
    
    const itemsToReturn: CartItem[] = [];
    selectedInvoice.items.forEach(item => {
      const returnQty = returnQuantities[item.id] || 0;
      if (returnQty > 0) {
        itemsToReturn.push({
          ...item,
          quantity: -returnQty, // Negative quantity for return
          originalInvoiceId: selectedInvoice.id
        });
      }
    });

    if (itemsToReturn.length > 0) {
      onExchange(selectedInvoice, itemsToReturn);
      setSelectedInvoice(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Orders & Returns</h1>
        <p className="text-zinc-500 text-sm mt-1">Lookup past receipts to process exchanges or reprints.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 mb-6">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Order ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Total</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-zinc-600">#{inv.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-6 py-4 text-sm text-zinc-600">
                  {new Date(inv.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900 font-medium">{inv.customerName}</td>
                <td className={`px-6 py-4 text-sm font-bold ${inv.total < 0 ? 'text-red-600' : 'text-zinc-900'}`}>
                  ${inv.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => onViewInvoice(inv.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    <Eye className="w-3 h-3 mr-1.5" />
                    View
                  </button>
                  <button 
                    onClick={() => handleReturnClick(inv)}
                    className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 mr-1.5" />
                    Exchange
                  </button>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Return/Exchange Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <h3 className="font-bold text-zinc-900">Select Items to Return</h3>
              <p className="text-sm text-zinc-500">Order #{selectedInvoice.id.slice(0,8)}</p>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              {selectedInvoice.items.filter(i => i.quantity > 0).map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-zinc-100 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900">{item.name}</p>
                    <p className="text-xs text-zinc-500">Sold at ${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-xs text-zinc-500 uppercase font-bold">Qty to Return:</div>
                    <select 
                      className="border border-zinc-200 rounded px-2 py-1"
                      value={returnQuantities[item.id] || 0}
                      onChange={(e) => handleQuantityChange(item.id, item.quantity, parseInt(e.target.value))}
                    >
                      {[...Array(item.quantity + 1).keys()].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={submitExchange}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center"
              >
                <span>Process Return & Shop</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
