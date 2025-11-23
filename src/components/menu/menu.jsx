import './menu.css'
import React, { useState, useEffect } from 'react';
import Cart from './Cart';
import Payment from './payment';
import PaymentMethod from './paymentMethod';
import { Routes, Route, Link } from 'react-router-dom'
import { Search, Heart, ShoppingCart, User, Menu, ChevronDown, Check, SlidersHorizontal, MapPin, DollarSign, Leaf, Wheat, Egg, Fish, Droplet } from 'lucide-react';

const Header = () => (
  <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
    <div className="flex items-center space-x-8">
      <Link to="/">
        <a href="#" className="nav-logo-link">Expirapp</a>
      </Link>
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

const FilterItem = ({ title, icon, selected = false, dropdown = false, children }) => (
  <div className="bg-white rounded-lg shadow-sm">
    <button className={`w-full flex justify-between items-center text-left ${selected ? 'text-green-700 bg-green-50 rounded-lg p-3' : 'text-gray-600 p-3 hover:bg-gray-50 rounded-lg'}`}>
      <div className="flex items-center space-x-3">
        {React.cloneElement(icon, { size: 20 })}
        <span className="text-sm font-medium">{title}</span>
      </div>
      {dropdown && <ChevronDown size={18} className={`transition-transform ${selected ? 'rotate-180' : ''}`} />}
      {children}
    </button>
    {/* Optional: Dropdown content here if needed */}
  </div>
);

const FilterToggle = ({ title, icon, checked, onToggle }) => (
  <div className="py-3 border-b border-gray-100 last:border-b-0">
    <div className="w-full flex justify-between items-center text-left p-3">
      <div className="flex items-center space-x-3 text-gray-600">
        {React.cloneElement(icon, { size: 20 })}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only peer" />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
      </label>
    </div>
  </div>
);

const ProductCard = ({ product, onOpen }) => {
  const isDonation = product.badge === "Donación";
  const hasOffer = product.badge === "Oferta";

  return (
    <div onClick={onOpen} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group cursor-pointer">
      {/* Image with Badge */}
      <div className="relative h-48 sm:h-48 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x300/cccccc/333333?text=${product.name.substring(0, 10).replace(' ', '+')}`; }}
        />
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

const Pagination = () => (
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


const Home = ({ onlyDonations, setOnlyDonations, products, loading, error }) => (
  <main >
    {/* Title and Search Bar */}
    <Header/>
    <div className="flex flex-col margin-left: auto lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8">
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
          <br></br>
          {/* Precio */}
          <FilterItem title="Precio" icon={<DollarSign />} dropdown />
          <br></br>
          {/* Cercanía */}
          <FilterItem title="Cercanía" icon={<MapPin />} dropdown />
          <br></br>
          {/* Solo donaciones (Toggle) */}
          <FilterToggle
            title="Solo donaciones"
            icon={<Heart />}
            checked={onlyDonations}
            onToggle={() => setOnlyDonations(!onlyDonations)}
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

const App = () => {
  const [onlyDonations, setOnlyDonations] = useState(false);
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Cart state lifted to App so it can be shared with Cart.jsx
  const [cartData, setCartData] = useState([]);
  // Selected product for detail modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // add product to cart (simple grouping by location/store)
  const addToCart = (product, quantity = 1) => {
    setCartData(prev => {
      const itemId = `p-${product.id}`;
      // try find a store matching product.location, else use a default store
      const storeName = product.location || 'Tienda';
      const storeId = storeName.replace(/\s+/g,'-').toLowerCase();

      // clone
      const next = JSON.parse(JSON.stringify(prev || []));

      // find store
      let store = next.find(s => s.store === storeName);
      if (!store) {
        store = { id: Date.now(), store: storeName, items: [] };
        next.push(store);
      }

      const existing = store.items.find(i => i.itemId === itemId);
      if (existing) {
        existing.quantity = (existing.quantity || 0) + quantity;
      } else {
        store.items.push({
          itemId,
          name: product.name,
          brand: product.brand || '',
          size: product.size || '',
          expiryDate: product.fecha_vencimiento || '',
          originalPrice: product.originalPrice ?? product.price ?? 0,
          salePrice: product.price ?? 0,
          quantity: quantity,
          imageUrl: product.imageUrl || ''
        });
      }

      return next;
    });
  };

  // open product detail
  useEffect(() => {
    const handler = (e) => setSelectedProduct(e.detail);
    window.addEventListener('openProduct', handler);
    return () => window.removeEventListener('openProduct', handler);
  }, []);

  const closeProduct = () => setSelectedProduct(null);

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
        let json;
        if (contentType.includes('application/json')) {
          json = await res.json();
        } else {
          // If the server returned HTML (e.g. index.html) or plain text, capture snippet for debugging
          const text = await res.text();
          throw new Error(`Invalid JSON response from ${url}: ${text.slice(0,200)}`);
        }
        const list = json.productos || json.products || json.data || [];
        const mapped = list.map(p => ({
          id: p.id_producto ?? p.id ?? Math.random(),
          name: p.nombre ?? p.name ?? 'Producto',
          price: typeof p.precio !== 'undefined' ? p.precio : (p.price ?? 0),
          fecha_vencimiento: p.fecha_vencimiento ?? p.expiryDate ?? null,
          stock: typeof p.stock !== 'undefined' ? p.stock : (p.cantidad ?? null),
          // Description and image fields (try multiple possible keys from backend)
          descripcion: p.descripcion ?? p.description ?? p.descripcion ?? '',
          imageUrl: p.imagen ?? p.imageUrl ?? p.image ?? p.url_imagen ?? `https://placehold.co/300x300/cccccc/333333?text=${encodeURIComponent((p.nombre||p.name||'Producto').substring(0,10))}`,
        }));
        if (mounted) setProducts(mapped);
      } catch (err) {
        if (mounted) setError(err.message || 'Error desconocido');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans w-full">
      <Routes>
        <Route path="/" element={<Home onlyDonations={onlyDonations} setOnlyDonations={setOnlyDonations} products={products} loading={loading} error={error} />} />
        <Route path="/cart" element={<Cart cartData={cartData} setCartData={setCartData} />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/method" element={<PaymentMethod cartData={cartData} setCartData={setCartData} />} />
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
                <p className="text-sm text-gray-600">{selectedProduct.descripcion || selectedProduct.description || ''}</p>
                <p className="mt-2 text-sm text-gray-700">Stock: {typeof selectedProduct.stock !== 'undefined' && selectedProduct.stock !== null ? selectedProduct.stock : '—'}</p>
                <p className="mt-3 font-bold text-lg text-gray-800">${selectedProduct.price}</p>
                <p className="text-sm text-gray-500 mt-1">Vence: {selectedProduct.fecha_vencimiento || selectedProduct.expiryDate || '—'}</p>

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