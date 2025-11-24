import React, { useMemo, useState } from 'react';
import './InventoryManagement.css';

interface InventoryItem {
  name: string;
  sku: string;
  expiration: string;
  price: number;
  offerPrice: number;
  stock: number;
  status: 'Activo' | 'Agotado';
}

const INVENTORY_DATA: InventoryItem[] = [
  {
    name: 'Yogurt Natural Dance',
    sku: '12345',
    expiration: '25/12/2024',
    price: 5.0,
    offerPrice: 3.5,
    stock: 10,
    status: 'Activo',
  },
  {
    name: 'Pan de Molde Bimbo',
    sku: '67890',
    expiration: '23/10/2024',
    price: 2.5,
    offerPrice: 2.25,
    stock: 25,
    status: 'Activo',
  },
  {
    name: 'Leche Entera Pascual',
    sku: '12121',
    expiration: '22/12/2024',
    price: 1.8,
    offerPrice: 1.5,
    stock: 8,
    status: 'Agotado',
  },
  {
    name: 'Queso Curado García Baquero',
    sku: '23343',
    expiration: '23/12/2024',
    price: 10.3,
    offerPrice: 9.1,
    stock: 20,
    status: 'Activo',
  },
];

const statusClass = (status: InventoryItem['status']) =>
  status === 'Activo' ? 'inventory-badge success' : 'inventory-badge warning';

const InventoryManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | InventoryItem['status']>('Todos');

  const filteredItems = useMemo(() => {
    return INVENTORY_DATA.filter((item) => {
      const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter;
      const normalizedSearch = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(normalizedSearch) || item.sku.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div className="inventory-brand">Expirapp</div>
        <button className="inventory-add">Añadir Nuevo Producto</button>
      </header>

      <main className="inventory-content">
        <div className="inventory-title-row">
          <h1 className="inventory-title">Gestión de Inventario</h1>
          <div className="inventory-filters">
            <div className="inventory-search">
              <input
                type="search"
                placeholder="Buscar por nombre o SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="inventory-select" aria-label="Fecha de caducidad">
              <option>Fecha de caducidad</option>
            </select>
            <select className="inventory-select" aria-label="Categoría">
              <option>Categoría</option>
            </select>
            <select
              className="inventory-select"
              aria-label="Estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'Todos' | InventoryItem['status'])}
            >
              <option value="Todos">Estado</option>
              <option value="Activo">Activo</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>
        </div>

        <section className="inventory-table" aria-label="Tabla de inventario">
          <div className="inventory-table-header">
            <span>Producto</span>
            <span>SKU</span>
            <span>Fecha Cad.</span>
            <span>Precio Orig.</span>
            <span>Precio Oferta</span>
            <span>Stock</span>
            <span>Estado</span>
            <span>Acciones</span>
          </div>

          {filteredItems.map((item) => (
            <div className="inventory-row" key={item.sku}>
              <span className="inventory-product">{item.name}</span>
              <span>{item.sku}</span>
              <span className="inventory-expiration">{item.expiration}</span>
              <span>{item.price.toFixed(2)}€</span>
              <span className="inventory-offer">{item.offerPrice.toFixed(2)}€</span>
              <span>{item.stock}</span>
              <span className={statusClass(item.status)}>{item.status}</span>
              <span className="inventory-actions">
                <button className="inventory-action">✏️</button>
                <button className="inventory-action">🗑️</button>
              </span>
            </div>
          ))}
        </section>

        <div className="inventory-pagination" aria-label="Paginación de inventario">
          {[1, 2, 3].map((page) => (
            <button key={page} className={`inventory-page-btn ${page === 1 ? 'active' : ''}`}>
              {page}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default InventoryManagement;
