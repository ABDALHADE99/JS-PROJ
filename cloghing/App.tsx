import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Store } from './pages/Store';
import { Admin } from './pages/Admin';
import { InvoiceView } from './pages/Invoice';
import { Orders } from './pages/Orders';
import { Product, CartItem, Invoice, ViewState } from './types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Minimalist Cotton Tee',
    category: 'Tops',
    price: 35.00,
    description: 'A premium weight cotton t-shirt with a relaxed fit. Essential for any wardrobe.',
    image: 'https://picsum.photos/400/500?random=1'
  },
  {
    id: '2',
    name: 'Slim Tapered Denim',
    category: 'Bottoms',
    price: 89.00,
    description: 'Japanese selvedge denim with a modern slim taper cut.',
    image: 'https://picsum.photos/400/500?random=2'
  },
  {
    id: '3',
    name: 'Merino Wool Cardigan',
    category: 'Outerwear',
    price: 120.00,
    description: 'Ultra-soft merino wool cardigan perfect for layering.',
    image: 'https://picsum.photos/400/500?random=3'
  },
  {
    id: '4',
    name: 'Canvas Low-Tops',
    category: 'Footwear',
    price: 65.00,
    description: 'Classic canvas sneakers with a durable rubber sole.',
    image: 'https://picsum.photos/400/500?random=4'
  },
  {
    id: '5',
    name: 'Oxford Button Down',
    category: 'Tops',
    price: 55.00,
    description: 'Crisp white oxford shirt, essential for business casual.',
    image: 'https://picsum.photos/400/500?random=5'
  },
  {
    id: '6',
    name: 'Leather Belt',
    category: 'Accessories',
    price: 45.00,
    description: 'Full grain leather belt with brass buckle.',
    image: 'https://picsum.photos/400/500?random=6'
  }
];

// Mock initial invoice for demo purposes
const MOCK_INVOICE: Invoice = {
  id: 'INV-DEMO-001',
  date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  customerName: 'Alice Smith',
  customerEmail: 'alice@example.com',
  type: 'SALE',
  items: [
    { ...INITIAL_PRODUCTS[0], quantity: 2 },
    { ...INITIAL_PRODUCTS[1], quantity: 1 }
  ],
  total: 169.00 * 1.08,
  subtotal: 169.00,
  tax: 169.00 * 0.08
};

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'STORE' });
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([MOCK_INVOICE]);

  // POS Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      // Check if item already exists with the same price (handles returns vs sales of same item technically, though usually returns have flag)
      // For simplicity, we just look for ID. If we are adding a normal product, we look for existing normal product (qty > 0)
      const existingIndex = prev.findIndex(item => item.id === product.id && item.quantity > 0);
      
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        // If it's a return (negative quantity), we handle it differently or block it in UI
        if (item.quantity < 0) return item; 
        
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  // Exchange Logic
  const handleExchange = (originalInvoice: Invoice, itemsToReturn: CartItem[]) => {
    // Add returned items to cart with negative quantity
    setCart(prev => [...prev, ...itemsToReturn]);
    setCurrentView({ type: 'STORE' });
  };

  // Checkout / Payment Logic
  const handleCheckout = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // Simple tax logic
    const total = subtotal + tax;
    
    // Determine Invoice Type
    let type: Invoice['type'] = 'SALE';
    const hasReturns = cart.some(i => i.quantity < 0);
    const hasSales = cart.some(i => i.quantity > 0);
    
    if (total < 0) type = 'REFUND';
    else if (hasReturns && hasSales) type = 'EXCHANGE';

    const newInvoice: Invoice = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      tax,
      total,
      customerName: 'Guest Customer',
      customerEmail: 'guest@example.com',
      type
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setCart([]);
    setCurrentView({ type: 'INVOICE', invoiceId: newInvoice.id });
  };

  // Admin Logic
  const handleAddProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const handleEditProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Rendering
  const renderView = () => {
    switch (currentView.type) {
      case 'ADMIN':
        return (
          <Admin 
            products={products}
            invoices={invoices}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'ORDERS':
        return (
          <Orders 
            invoices={invoices} 
            onExchange={handleExchange}
            onViewInvoice={(id) => setCurrentView({ type: 'INVOICE', invoiceId: id })}
          />
        );
      case 'INVOICE':
        const invoice = invoices.find(i => i.id === (currentView as any).invoiceId);
        if (!invoice) return <div>Invoice not found</div>;
        return <InvoiceView invoice={invoice} onBack={() => setCurrentView({ type: 'STORE' })} />;
      case 'STORE':
      default:
        return (
          <Store 
            products={products} 
            cart={cart}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onCheckout={handleCheckout}
            onClearCart={clearCart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-indigo-100">
      {/* Hide Navbar on Invoice Print View for cleaner look */}
      {currentView.type !== 'INVOICE' && (
        <Navbar 
          onNavigate={(view) => setCurrentView({ type: view })}
          currentView={currentView.type as any}
        />
      )}

      <main>
        {renderView()}
      </main>
    </div>
  );
};

export default App;