import './menu.css';
import React, { useState, useEffect } from 'react';
import Cart from './Cart.tsx'
import Payment from './payment.tsx';
import PaymentMethod from './paymentMethod.tsx';
import { Routes, Route, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, DollarSign, Leaf, Heart, Check, ChevronDown, ShoppingCart, Menu, X } from 'lucide-react';
import { Product, CartStore, CartItem } from '../../../types/menu.types';
import { productService } from '../../../services/productService';
import { FilterItem } from '../components/MenuComponents';
import { Header } from '../../common/Header';
import { ProductCard } from '../components/ProductCard';
import { Login } from '../../auth/Login';
import { Register } from '../../auth/Register';
import { ForgotPassword } from '../../auth/ForgotPassword';
import { ResetPassword } from '../../auth/ResetPassword';
import { UserProfile } from '../../profile/UserProfile';
import { StoreProfile } from '../../profile/StoreProfile';
import { StoreRegistration } from '../../store/StoreRegistration';
import { CreateProduct } from '../../store/CreateProduct';
import { useNavigate } from 'react-router-dom';
import OrderHistory from '../../orders/OrderHistory';
import InventoryManagement from '../../inventory/InventoryManagement'

interface HomeProps {
  onlyDonations: boolean;
  setOnlyDonations: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  loading: boolean;
  error: string | null;
  onProductClick: (product: Product) => void;
}



interface FilterToggleProps {
  title: string;
  icon: React.ReactElement;
  checked: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterToggle: React.FC<FilterToggleProps> = ({ title, icon, checked, onToggle }) => (
  <div className="filter-toggle-item">
    <div className="filter-toggle-content">
      <div className="filter-toggle-label">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any, any>, { size: 20 }) : icon}
        <span>{title}</span>
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={checked} onChange={onToggle} className="toggle-input" />
        <div className="toggle-track">
          <div className="toggle-thumb"></div>
        </div>
      </label>
    </div>
  </div>
);

const Pagination: React.FC = () => (
  <div className="pagination">
    <button className="pagination-nav">
      <ChevronDown size={20} className="rotate-90" />
    </button>
    {[1, 2, 3, '...', 10].map((page, index) => (
      <button
        key={index}
        className={`pagination-button ${page === 1 ? 'active' : ''}`}
        disabled={page === '...'}
      >
        {page}
      </button>
    ))}
    <button className="pagination-nav">
      <ChevronDown size={20} className="-rotate-90" />
    </button>
  </div>
);

const Home: React.FC<HomeProps> = ({ onlyDonations, setOnlyDonations, products, loading, error, onProductClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = (products || []).filter(p => {
    const matchesDonation = !onlyDonations || p.badge === 'Donación';
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDonation && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans w-full">
      <Header />
      <main className="menu-page">
        <div className="page-header">
          <div className="page-title">
            {searchQuery ? (
              <h2>Resultados de búsqueda</h2>
            ) : (
              <h2>Explorar Productos</h2>
            )}
            <p>Productos cerca de ti</p>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={20} className="search-icon" />
          </div>
        </div>

        <div className="menu-layout">
          <aside className="filters-sidebar">
            <h3 className="filter-section-title">
              <SlidersHorizontal size={20} />
              <span>Filtros</span>
            </h3>

            <div className="filter-list">
              <FilterItem title="Categoría" icon={<Leaf />} selected dropdown>
                <div className="filter-check">
                  <Check size={14} />
                </div>
              </FilterItem>
              <FilterItem title="Precio" icon={<DollarSign />} dropdown />
              <FilterItem title="Cercanía" icon={<MapPin />} dropdown />
              <FilterToggle
                title="Solo donaciones"
                icon={<Heart />}
                checked={onlyDonations}
                onToggle={(e) => setOnlyDonations(e.target.checked)}
              />
            </div>
          </aside>

          <section className="products-section">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="error-state">
                <p className="text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                  Error cargando productos: {error}
                </p>
              </div>
            ) : (
              <>
                {filteredProducts.length > 0 ? (
                  <>
                    <div className="products-grid">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onOpen={() => onProductClick(product)}
                        />
                      ))}
                    </div>
                    <Pagination />
                  </>
                ) : (
                  <div className="empty-state-container">
                    <div className="empty-state-icon-wrapper">
                      <Search size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="empty-state-title">Aún no hay productos</h3>
                    <p className="empty-state-text">
                      {searchQuery
                        ? `No encontramos productos que coincidan con "${searchQuery}".`
                        : "No hay productos disponibles en este momento. Intenta ajustar tus filtros o vuelve más tarde."}
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

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
          brand: product.brand || '',
          size: product.size || '',
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
        <Route path="/store-profile" element={<StoreProfile />} />

        {/* Store Routes */}
        <Route path="/store-registration" element={<StoreRegistration />} />
        <Route path="/create-product" element={<CreateProduct />} />

        {/* Orders & Inventory */}
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/inventory" element={<InventoryManagement />} />
      </Routes>

      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button
              onClick={() => setSelectedProduct(null)}
              className="modal-close"
            >
              <X size={20} />
            </button>

            <div className="modal-body">
              <div className="modal-image-section">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="modal-image"
                />
              </div>

              <div className="modal-info-section">
                <div className="modal-header">
                  <div>
                    <h3 className="modal-title">{selectedProduct.name}</h3>
                    <p className="modal-location">
                      <MapPin size={16} />
                      {selectedProduct.location}
                    </p>
                  </div>
                  <div className="modal-price-block">
                    <p className="modal-price">${selectedProduct.price}</p>
                    {selectedProduct.originalPrice && (
                      <p className="modal-original-price">${selectedProduct.originalPrice}</p>
                    )}
                  </div>
                </div>

                <p className="modal-description">
                  {selectedProduct.descripcion || 'Sin descripción disponible.'}
                </p>

                <div className="modal-meta-grid">
                  <div className="modal-meta-item">
                    <span className="modal-meta-label">Stock disponible</span>
                    <span className="modal-meta-value">
                      {typeof selectedProduct.stock !== 'undefined' && selectedProduct.stock !== null ? selectedProduct.stock : '—'} unidades
                    </span>
                  </div>
                  <div className="modal-meta-item">
                    <span className="modal-meta-label">Fecha de vencimiento</span>
                    <span className="modal-meta-value">
                      {selectedProduct.fecha_vencimiento ? new Date(selectedProduct.fecha_vencimiento).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="btn-modal-cancel"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => { addToCart(selectedProduct, 1); setSelectedProduct(null); }}
                    className="btn-modal-add"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;