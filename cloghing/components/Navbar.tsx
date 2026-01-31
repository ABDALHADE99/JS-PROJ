import React from 'react';
import { ShoppingBag, Settings, History, LayoutGrid, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: 'STORE' | 'ADMIN' | 'ORDERS') => void;
  currentView: 'STORE' | 'ADMIN' | 'ORDERS' | 'INVOICE';
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate('STORE')}
          >
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">Lumina POS</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onNavigate('STORE')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'STORE' 
                  ? 'bg-zinc-100 text-zinc-900' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <LayoutGrid className="w-4 h-4" />
                <span>Register</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('ORDERS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'ORDERS' 
                  ? 'bg-zinc-100 text-zinc-900' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>Orders & Returns</span>
              </div>
            </button>
            
            <button
              onClick={() => onNavigate('ADMIN')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'ADMIN' 
                  ? 'bg-zinc-100 text-zinc-900' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};