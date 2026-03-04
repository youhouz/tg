export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  unitLabel: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export interface ProductFilters {
  category?: string;
  origin?: string;
  quality?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name' | 'newest';
  page?: number;
}
