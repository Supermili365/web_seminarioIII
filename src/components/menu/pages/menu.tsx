import './menu.css';
import React, { useState, useEffect } from 'react';
import Cart from './Cart.tsx';
import Payment from './Payment.tsx';
import PaymentMethod from './PaymentMethod.tsx';
import { Routes, Route } from 'react-router-dom';
import { Product, CartStore, CartItem } from '../../../types/menu.types';
import { productService } from '../../../services/productService';
import { Login } from '../../auth/Login';
import { Register } from '../../auth/Register';
import { ForgotPassword } from '../../auth/ForgotPassword';
import { ResetPassword } from '../../auth/ResetPassword';
import { UserProfile } from '../../profile/UserProfile';
import { StoreProfile } from '../../profile/StoreProfile';
import { StoreRegistration } from '../../store/StoreRegistration';
import { CreateProduct } from '../../store/CreateProduct';
import OrderHistory from '../../orders/OrderHistory';
import InventoryManagement from '../../inventory/InventoryManagement';
import FormPublication from '../../Publication/FormPublication';
import { Home } from './Home';
import { ProductModal } from '../components/ProductModal';

const App: React.FC = () => {
  const [onlyDonations, setOnlyDonations] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cartData, setCartData] = useState<CartStore[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartData(prev => {
      const itemId: string = `p-${product.id}`;
      const storeName: string = product.location || 'Tienda';
      const next: CartStore[] = prev.map(store => ({ ...store, items: [...store.items] }));

      let store: CartStore | undefined = next.find(s => s.store === storeName);
      if (!store) {
        // Debug log to see why storeId might be missing
        console.log('Adding new store to cart. Product:', product);
        const safeStoreId = product.storeId || 0;
        if (!product.storeId) {
          console.warn(`Product "${product.name}" is missing storeId. Defaulting to 0.`, product);
        }
        store = { id: safeStoreId, store: storeName, items: [] };
        next.push(store);
      }

      const existing: CartItem | undefined = store.items.find(i => i.itemId === itemId);

      if (existing) {
        existing.quantity = (existing.quantity || 0) + quantity;
      } else {
        const newItem: CartItem = {
          itemId,
          name: product.name,
          expiryDate: product.fecha_vencimiento || '',
          originalPrice: product.originalPrice ?? product.price ?? 0,
          salePrice: product.price ?? 0,
          quantity: quantity,
          imageUrl: product.imageUrl || ''
        };
        store.items.push(newItem);
      }

      return next;
    });
  };

  useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getAllProducts();
        if (mounted) setProducts(data);
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
          setError(errorMessage);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans w-full">
      <Routes>
        <Route path="/" element={
          <Home
            onlyDonations={onlyDonations}
            setOnlyDonations={setOnlyDonations}
            products={products}
            loading={loading}
            error={error}
            onProductClick={setSelectedProduct}
          />
        } />
        <Route path="/cart" element={<Cart cartData={cartData} setCartData={setCartData} />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/method" element={<PaymentMethod cartData={cartData as any} setCartData={setCartData as any} />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Profile Routes */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/store-profile" element={<StoreProfile />} />

        {/* Store Routes */}
        <Route path="/store-registration" element={<StoreRegistration />} />
        <Route path="/create-product" element={<CreateProduct />} />

        {/* Orders & Inventory */}
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/publicar" element={<FormPublication />} />
      </Routes>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default App;