export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
  // If true, this item represents a return (quantity will be negative)
  originalInvoiceId?: string; 
}

export interface Invoice {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  customerName: string;
  customerEmail: string;
  type: 'SALE' | 'REFUND' | 'EXCHANGE';
}

export type ViewState = 
  | { type: 'STORE' }
  | { type: 'ADMIN' }
  | { type: 'ORDERS' }
  | { type: 'INVOICE'; invoiceId: string };
