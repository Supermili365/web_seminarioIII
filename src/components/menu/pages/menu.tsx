import './menu.css';
import React, { useState, useEffect, ReactElement } from 'react';
import Cart from './Cart.tsx';
import Payment from './payment.tsx';
import PaymentMethod from './paymentMethod.tsx';
import { Routes, Route, Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, ChevronDown, Check, SlidersHorizontal, MapPin, DollarSign, Leaf, Wheat, Egg, Fish, Droplet } from 'lucide-react';


interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number; 
  badge?: 'Oferta' | 'Donación' | string; 
  imageUrl: string;
  location: string;
  distance?: string;
  icon?: ReactElement<any, any>;
  descripcion?: string;
  fecha_vencimiento?: string | null;
  stock?: number | null;
  brand?: string;
  size?: string;
}

interface CartItem {
  itemId: string; 
  name: string;
  brand: string;
  size: string;
  expiryDate: string;
  originalPrice: number;
  salePrice: number;
  quantity: number;
  imageUrl: string;
}


interface CartStore {
  id: number;
  store: string;
  items: CartItem[];
}


interface HomeProps {
  onlyDonations: boolean;
  setOnlyDonations: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  loading: boolean;
  error: string | null;
}


interface FilterItemProps {
  title: string;
  icon: ReactElement<any, any>; 
  selected?: boolean;
  dropdown?: boolean;
  children?: React.ReactNode;
}


interface FilterToggleProps {
  title: string;
  icon: ReactElement<any, any>;
  checked: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ProductCardProps {
  product: Product;
  onOpen: () => void;
}

interface CartProps {
  cartData: CartStore[];
  setCartData: React.Dispatch<React.SetStateAction<CartStore[]>>;
}

const Header: React.FC = () => (
  <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
    {/* ... (Contenido del Header, sin cambios en JS/TS) ... */}
    <div className="flex items-center space-x-8">
      <Link to="/" className="nav-logo-link">Expirapp</Link>
    </div>
    <nav className="hidden lg:flex items-center gap-6 text-black-600 text-sm font-bold">
      <a href="#">Categorías</a>
      <a href="#">Ofertas</a>
      <a href="#">Donaciones</a>
      <a href="#">Sobre Nosotros</a>
    </nav>
    <div className="flex items-center space-x-4">
      <button className="btn-login hidden sm:inline-flex items-center justify-center text-sm rounded-lg shadow-sm">
        Iniciar Sesión
      </button>
      <button className="btn-icon">
        <Heart size={20} />
      </button>
      <Link to="/cart">
        <button className="btn-icon">
          <ShoppingCart size={20} />
        </button>
      </Link>
      <button className="lg:hidden p-2 rounded-full hover:bg-gray-100 text-gray-500">
        <Menu size={20} />
      </button>
    </div>
  </header>
);

const FilterItem: React.FC<FilterItemProps> = ({ title, icon, selected = false, dropdown = false, children }) => (
  <div className="bg-white rounded-lg shadow-sm">
    <button className={`w-full flex justify-between items-center text-left ${selected ? 'text-green-700 bg-green-50 rounded-lg p-3' : 'text-gray-600 p-3 hover:bg-gray-50 rounded-lg'}`}>
      <div className="flex items-center space-x-3">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any, any>, { size: 20 }) : icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      {dropdown && <ChevronDown size={18} className={`transition-transform ${selected ? 'rotate-180' : ''}`} />}
      {children}
    </button>
    {/* Optional: Dropdown content here if needed */}
  </div>
);

const FilterToggle: React.FC<FilterToggleProps> = ({ title, icon, checked, onToggle }) => (
  <div className="py-3 border-b border-gray-100 last:border-b-0">
    <div className="w-full flex justify-between items-center text-left p-3">
      <div className="flex items-center space-x-3 text-gray-600">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any, any>, { size: 20 }) : icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        {/* Usamos el tipado para onToggle en la interfaz */}
        <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only peer" />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
      </label>
    </div>
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpen }) => {
  const isDonation = product.badge === "Donación";
  const hasOffer = product.badge === "Oferta";

  // Tipado explícito para el evento onError
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = `https://placehold.co/300x300/cccccc/333333?text=${product.name.substring(0, 10).replace(' ', '+')}`;
  };

  return (
    <div onClick={onOpen} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group cursor-pointer">
      {/* Image with Badge */}
      <div className="relative h-48 sm:h-48 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={handleImageError}
        />
        {/* ... (Badge logic) ... */}
        {product.badge && (
          <span
            className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md
              ${isDonation ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-900'}
            `}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col space-y-1">
        <h3 className="text-base font-semibold text-gray-800 truncate">{product.name}</h3>
        <div className="flex items-end space-x-2">
          {isDonation ? (
            <span className="text-lg font-bold text-green-600">{product.price}</span>
          ) : (
            <>
              <span className="text-lg font-bold text-gray-800">${product.price}</span>
              {hasOffer && product.originalPrice && (
                <span className="text-sm line-through text-gray-400">${product.originalPrice}</span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
          {product.icon}
          <span className="truncate">{product.location}</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <MapPin size={12} className="text-gray-400" />
          <span>{product.distance}</span>
        </div>
      </div>
    </div>
  );
};

const Pagination: React.FC = () => (
  <div className="flex justify-center items-center space-x-2 py-8">
    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition">
      <ChevronDown size={20} className="rotate-90" />
    </button>
    {[1, 2, 3, '...', 10].map((page, index) => (
      <button
        key={index}
        className={`w-8 h-8 rounded-full text-sm font-medium transition
          ${page === 1 ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}
          ${page === '...' ? 'cursor-default hover:bg-transparent' : ''}
        `}
        disabled={page === '...'}
      >
        {page}
      </button>
    ))}
    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition">
      <ChevronDown size={20} className="-rotate-90" />
    </button>
  </div>
);


const Home: React.FC<HomeProps> = ({ onlyDonations, setOnlyDonations, products, loading, error }) => (
  <main >
    {/* Title and Search Bar */}
    <Header/>
    <div className="flex flex-col ml-auto lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8">
      <div className="mb-4 lg:mb-0">
        <h2 className="text-3xl font-bold text-gray-800">Resultados de búsqueda</h2>
        <p className="text-gray-500">Productos cerca de ti</p>
      </div>
      <div className="w-full lg:w-96 relative">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
        />
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>

    {/* Filters and Product Grid Layout */}
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full lg:w-72 bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <SlidersHorizontal size={20} />
          <span>Filtros</span>
        </h3>

        <div className="space-y-3">
          {/* Categoría (Selected) */}
          <FilterItem title="Categoría" icon={<Leaf />} selected dropdown>
            <div className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
              <Check size={14} />
            </div>
          </FilterItem>
          <br />
          {/* Precio */}
          <FilterItem title="Precio" icon={<DollarSign />} dropdown />
          <br />
          {/* Cercanía */}
          <FilterItem title="Cercanía" icon={<MapPin />} dropdown />
          <br />
          {/* Solo donaciones (Toggle) */}
          <FilterToggle
            title="Solo donaciones"
            icon={<Heart />}
            checked={onlyDonations}
            // onToggle ahora recibe un evento tipado: React.ChangeEvent<HTMLInputElement>
            onToggle={(e) => setOnlyDonations(e.target.checked)} 
          />
        </div>
      </aside>

      {/* Product Grid */}
      <section className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">Error cargando productos: {error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {(products || []).filter(p => !onlyDonations || p.badge === 'Donación').map((product) => (
                  <ProductCard key={product.id} product={product} onOpen={() => window.dispatchEvent(new CustomEvent('openProduct',{detail:product}))} />
                ))}
              </div>
              {/* Pagination */}
              <Pagination />
            </>
          )}
      </section>
    </div>
  </main>
)

const App: React.FC = () => {
  // 1. Tipado del State (useState)
  const [onlyDonations, setOnlyDonations] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]); // mockProducts debe ser eliminado o tipado
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cartData, setCartData] = useState<CartStore[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Puede ser Product o null

  // 2. Tipado de la función
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartData(prev => {
      const itemId: string = `p-${product.id}`;
      const storeName: string = product.location || 'Tienda';

      // TIP: En TS es mejor evitar JSON.parse(JSON.stringify(prev)) para clonar 
      // y usar el Spread Operator (...) para inmutabilidad.
      const next: CartStore[] = prev.map(store => ({ ...store, items: [...store.items] }));

      // find store
      let store: CartStore | undefined = next.find(s => s.store === storeName);
      if (!store) {
        // ID aleatorio para la tienda (mejor usar un UUID)
        store = { id: Date.now(), store: storeName, items: [] };
        next.push(store);
      }

      // Aseguramos que 'store' sea mutable en este contexto, si se encontró en 'next'
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

  // 3. Tipado de Eventos (CustomEvent)
  useEffect(() => {
    // Definimos el tipo del evento personalizado
    interface ProductDetailEvent extends CustomEvent {
      detail: Product;
    }
    
    // El handler ahora espera el evento tipado
    const handler = (e: ProductDetailEvent) => setSelectedProduct(e.detail);
    
    // Aserción de tipos para agregar el Listener
    window.addEventListener('openProduct', handler as EventListener); 
    return () => window.removeEventListener('openProduct', handler as EventListener);
  }, []);

  const closeProduct = () => setSelectedProduct(null);

  // 4. Tipado del Fetch
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `http://localhost:8081/api/v1/products/`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const contentType = res.headers.get('content-type') || '';
        let json: any; // Usamos 'any' aquí si la estructura de respuesta es muy variable
        
        if (contentType.includes('application/json')) {
          json = await res.json();
        } else {
          const text = await res.text();
          throw new Error(`Invalid JSON response from ${url}: ${text.slice(0,200)}`);
        }
        
        const list: any[] = json.productos || json.products || json.data || [];
        
        // Mapeo con tipado explícito
        const mapped: Product[] = list.map(p => ({
          id: p.id_producto ?? p.id ?? Math.random(),
          name: p.nombre ?? p.name ?? 'Producto',
          price: typeof p.precio !== 'undefined' ? p.precio : (p.price ?? 0),
          fecha_vencimiento: p.fecha_vencimiento ?? p.expiryDate ?? null,
          stock: typeof p.stock !== 'undefined' ? p.stock : (p.cantidad ?? null),
          descripcion: p.descripcion ?? p.description ?? p.descripcion ?? '',
          imageUrl: p.imagen ?? p.imageUrl ?? p.image ?? p.url_imagen ?? `https://placehold.co/300x300/cccccc/333333?text=${encodeURIComponent((p.nombre||p.name||'Producto').substring(0,10))}`,
          // Campos nuevos que requieren un valor (aunque sea default) en la interfaz Product
          location: 'Ubicación Desconocida', // Asume un valor por defecto o cámbialo si viene del backend
        }));
        
        if (mounted) setProducts(mapped);
      } catch (err) {
        if (mounted) {
            // TypeScript necesita saber que 'err' es un error para obtener 'message'
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { mounted = false; };
  }, []);

  // 5. Componente Principal
  return (
    <div className="min-h-screen bg-gray-50 font-sans w-full">
      <Routes>
        {/* Tipado de props en los elementos de Route */}
        <Route path="/" element={<Home onlyDonations={onlyDonations} setOnlyDonations={setOnlyDonations} products={products} loading={loading} error={error} />} />
        <Route path="/cart" element={<Cart cartData={cartData} setCartData={setCartData} />} />
        <Route path="/payment" element={<Payment />} />
        {/* Usamos as CartProps en PaymentMethod para mantener la coherencia con los props */}
        <Route path="/payment/method" element={<PaymentMethod cartData={cartData as any} setCartData={setCartData as any} />} />
      </Routes>

      {/* Product detail modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
              <button onClick={closeProduct} className="text-gray-500">Cerrar</button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-44 object-cover rounded" />
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">{selectedProduct.descripcion || ''}</p>
                <p className="mt-2 text-sm text-gray-700">Stock: {typeof selectedProduct.stock !== 'undefined' && selectedProduct.stock !== null ? selectedProduct.stock : '—'}</p>
                <p className="mt-3 font-bold text-lg text-gray-800">${selectedProduct.price}</p>
                <p className="text-sm text-gray-500 mt-1">Vence: {selectedProduct.fecha_vencimiento || '—'}</p>

                <div className="mt-4 flex items-center space-x-3">
                  <button onClick={() => { addToCart(selectedProduct,1); closeProduct(); }} className="bg-green-600 text-white px-4 py-2 rounded">Agregar al carrito</button>
                  <button onClick={closeProduct} className="px-4 py-2 border rounded">Cancelar</button>
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