import React from 'react';
import { Invoice } from '../types';
import { Printer, ArrowLeft, RefreshCw } from 'lucide-react';

interface InvoiceViewProps {
  invoice: Invoice;
  onBack: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice, onBack }) => {
  return (
    <div className="min-h-screen bg-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center print:hidden">.
          <button 
            onClick={onBack}
            className="flex items-center text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Register
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </button>
        </div>

        <div className="bg-white rounded-none sm:rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
          {/* Header */}
          <div className="px-8 py-10 border-b border-zinc-100 bg-zinc-50/50 text-center">
            <div className="w-12 h-12 bg-zinc-900 text-white rounded-lg flex items-center justify-center mx-auto mb-4 font-bold text-xl">L</div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">Lumina Apparel</h1>
            <p className="text-zinc-500 text-sm">123 Fashion Ave, New York, NY</p>
            <p className="text-zinc-500 text-sm">support@lumina.com | (555) 123-4567</p>
          </div>

          {/* Invoice Meta */}
          <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-white">
            <div>
              <p className="text-xs text-zinc-400 uppercase font-semibold">Order ID</p>
              <p className="text-zinc-900 font-mono">#{invoice.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-400 uppercase font-semibold">Date</p>
              <p className="text-zinc-900">
                {new Date(invoice.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Type Badge */}
          {invoice.type !== 'SALE' && (
             <div className="px-8 py-2 bg-amber-50 border-b border-amber-100 flex justify-center">
               <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                 invoice.type === 'REFUND' ? 'text-red-700 bg-red-100' : 'text-amber-700 bg-amber-100'
               }`}>
                 {invoice.type === 'EXCHANGE' ? 'Exchange Receipt' : 'Refund Receipt'}
               </span>
             </div>
          )}

          {/* Items */}
          <div className="p-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="pb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Item</th>
                  <th className="pb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Qty</th>
                  <th className="pb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Price</th>
                  <th className="pb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className={item.quantity < 0 ? 'bg-red-50/50' : ''}>
                    <td className="py-4 pr-2">
                      <div className="text-sm font-medium text-zinc-900">
                        {item.name}
                        {item.quantity < 0 && <span className="ml-2 text-xs text-red-500 font-bold bg-red-100 px-1 rounded">RETURN</span>}
                      </div>
                      <div className="text-xs text-zinc-500">{item.category}</div>
                    </td>
                    <td className="py-4 text-center text-sm text-zinc-600 font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-4 text-right text-sm text-zinc-600 font-mono">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className={`py-4 text-right text-sm font-medium font-mono ${item.quantity < 0 ? 'text-red-600' : 'text-zinc-900'}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-dashed border-zinc-300 pt-6 mt-6">
              <div className="flex justify-between py-1">
                <span className="text-sm text-zinc-500">Subtotal</span>
                <span className="text-sm font-medium font-mono text-zinc-900">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-zinc-500">Tax</span>
                <span className="text-sm font-medium font-mono text-zinc-900">${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 mt-2 border-t border-zinc-200 items-center">
                <span className="text-base font-bold text-zinc-900">Total</span>
                <span className={`text-xl font-bold font-mono ${invoice.total < 0 ? 'text-red-600' : 'text-zinc-900'}`}>
                  ${invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="mt-8 text-center space-y-2">
              <div className="w-full h-12 bg-zinc-100 rounded flex items-center justify-center">
                <span className="font-mono tracking-widest text-zinc-400 text-xs">BARCODE-PLACEHOLDER-{invoice.id.slice(0,6)}</span>
              </div>
              <p className="text-xs text-zinc-400">Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
