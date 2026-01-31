import React, { useState, useEffect, useRef } from 'react';
import { X, Wand2, Loader2, Upload } from 'lucide-react';
import { Product } from '../types';
import { generateProductDescription } from '../services/gemini';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product; // If provided, we are editing
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    description: '',
    image: `https://picsum.photos/400/500?random=${Date.now()}`
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      // Reset for new product
      setFormData({
        name: '',
        category: '',
        price: 0,
        description: '',
        image: '' // Start empty to encourage upload
      });
    }
  }, [product, isOpen]);

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) return;
    
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    onSave({
      id: product?.id || crypto.randomUUID(),
      name: formData.name,
      category: formData.category || 'Uncategorized',
      price: Number(formData.price),
      description: formData.description || '',
      image: formData.image || 'https://picsum.photos/400/500' // Fallback if still empty
    });
    onClose();
  };

  // Drag and Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-semibold text-zinc-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Vintage Denim Jacket"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select...</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Accessories">Accessories</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-zinc-700">Description</label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating || !formData.name}
                className="text-xs flex items-center space-x-1 text-indigo-600 font-medium hover:text-indigo-700 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                <span>Generate with AI</span>
              </button>
            </div>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Product Image</label>
            
            {/* Drop Zone */}
            <div 
              className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer overflow-hidden
                ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50'}
                ${formData.image ? 'border-solid border-zinc-200 p-0 h-48' : ''}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !formData.image && fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleChange}
              />

              {formData.image ? (
                <div className="relative w-full h-full group">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                      className="bg-white text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-zinc-100"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-zinc-900">Click to upload or drag & drop</p>
                  <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF</p>
                </div>
              )}
            </div>

            {/* Fallback URL input */}
            {!formData.image && (
              <div className="mt-2 flex items-center">
                <span className="text-xs text-zinc-400 mr-2 uppercase font-bold">OR</span>
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-1.5 border border-zinc-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500 bg-zinc-50"
                  value={formData.image || ''}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            )}
          </div>
        </form>

        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors shadow-sm"
          >
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
};