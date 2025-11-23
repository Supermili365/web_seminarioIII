import React, { useMemo, useState } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
 codex/analyze-this-project-d947pk
import { NavigateHandler } from '../../types/navigation.types';
=======
 master

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  expirationDate: string;
  category: string;
  priceOriginal: number;
  priceOffer: number;
  stock: number;
  status: 'Activo' | 'Agotado';
}

interface InventoryManagementProps {
 codex/analyze-this-project-d947pk
  onNavigate: NavigateHandler;
=======
  onNavigate: (view: string) => void;
 master
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: 1,
      name: 'Yogurt Natural Danone',
      sku: '12345',
      expirationDate: '2024-12-25',
      category: 'Lácteos',
      priceOriginal: 3.5,
      priceOffer: 3,
      stock: 15,
      status: 'Activo',
    },
    {
      id: 2,
      name: 'Pan de Molde Bimbo',
      sku: '67890',
      expirationDate: '2024-12-23',
      category: 'Panadería',
      priceOriginal: 2.5,
      priceOffer: 2,
      stock: 8,
      status: 'Activo',
    },
    {
      id: 3,
      name: 'Leche Entera Pascual',
      sku: '13579',
      expirationDate: '2024-12-22',
      category: 'Lácteos',
      priceOriginal: 1.9,
      priceOffer: 1.25,
      stock: 3,
      status: 'Agotado',
    },
    {
      id: 4,
      name: 'Queso Curado García Baquero',
      sku: '24680',
      expirationDate: '2025-01-03',
      category: 'Lácteos',
      priceOriginal: 6.5,
      priceOffer: 5,
      stock: 12,
      status: 'Activo',
    },
    {
      id: 5,
      name: 'Filetes de Pollo',
      sku: '11223',
      expirationDate: '2024-12-18',
      category: 'Carnes',
      priceOriginal: 7.2,
      priceOffer: 6,
      stock: 10,
      status: 'Activo',
    },
    {
      id: 6,
      name: 'Manzana Roja',
      sku: '33445',
      expirationDate: '2025-01-12',
      category: 'Frutas',
      priceOriginal: 0.9,
      priceOffer: 0.65,
      stock: 25,
      status: 'Activo',
    },
  ]);
  const [search, setSearch] = useState('');
  const [expirationFilter, setExpirationFilter] = useState('todas');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const categories = useMemo(() => {
    const unique = new Set(items.map((item) => item.category));
    return ['todas', ...Array.from(unique)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const now = new Date();
    const limitDate = new Date();
    limitDate.setDate(now.getDate() + 30);

    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());

      const expiration = new Date(item.expirationDate);
      const matchesExpiration =
        expirationFilter === 'todas'
          ? true
          : expirationFilter === 'proximas'
            ? expiration >= now && expiration <= limitDate
            : expiration < now;

      const matchesCategory = categoryFilter === 'todas' ? true : item.category === categoryFilter;
      const matchesStatus = statusFilter === 'todos' ? true : item.status === statusFilter;

      return matchesSearch && matchesExpiration && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, expirationFilter, items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: items.length + 1,
      name: 'Producto Nuevo',
      sku: `SKU-${items.length + 1}`,
      expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString().slice(0, 10),
      category: 'General',
      priceOriginal: 4,
      priceOffer: 3.5,
      stock: 20,
      status: 'Activo',
    };

    setItems((prev) => [newItem, ...prev]);
    setPage(1);
  };

  const badgeStyle = (status: InventoryItem['status']): React.CSSProperties => ({
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '9999px',
    backgroundColor: status === 'Activo' ? '#D1FAE5' : '#F3F4F6',
    color: status === 'Activo' ? '#047857' : '#4B5563',
    fontWeight: 600,
    fontSize: '13px',
  });

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    gap: '16px',
    flexWrap: 'wrap',
  };

  const filterRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
    gap: '12px',
    marginBottom: '16px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px 12px 42px',
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
    fontSize: '14px',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    color: '#6B7280',
    fontWeight: 600,
    padding: '12px',
    fontSize: '14px',
  };

  const rowStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    borderRadius: '12px',
  };

  const paginationButtonStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    background: '#FFFFFF',
    cursor: 'pointer',
  };

  const expiredDate = (date: string) => {
    const expiration = new Date(date);
    const now = new Date();
    return expiration < now;
  };

  const nearExpiration = (date: string) => {
    const expiration = new Date(date);
    const now = new Date();
    const limit = new Date();
    limit.setDate(now.getDate() + 5);
    return expiration >= now && expiration <= limit;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', padding: '24px 32px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#10B981', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>Ex</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#111827' }}>Gestión de Inventario</h1>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>Controla tus productos próximos a vencer y actualiza el stock.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('orders')}
          style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}
        >
          Historial de pedidos
        </button>
      </header>

      <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px 20px 8px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
        <div style={headerStyle}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={inputStyle}
            />
          </div>
          <button
            onClick={handleAddItem}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#10B981', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            <Plus size={18} /> Añadir Nuevo Producto
          </button>
        </div>

        <div style={filterRowStyle}>
          <div style={{ position: 'relative' }}>
            <AlertTriangle size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#F59E0B' }} />
            <select
              value={expirationFilter}
              onChange={(e) => {
                setExpirationFilter(e.target.value);
                setPage(1);
              }}
              style={{ ...selectStyle, paddingLeft: '38px' }}
            >
              <option value="todas">Fecha de caducidad</option>
              <option value="proximas">Próximos 30 días</option>
              <option value="vencidas">Vencidas</option>
            </select>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            style={selectStyle}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'todas' ? 'Categoría' : category}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={selectStyle}
          >
            <option value="todos">Estado</option>
            <option value="Activo">Activo</option>
            <option value="Agotado">Agotado</option>
          </select>
          <button
            onClick={() => onNavigate('login')}
            style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontWeight: 600, cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Producto</th>
              <th style={thStyle}>SKU</th>
              <th style={thStyle}>Fecha Cad.</th>
              <th style={thStyle}>Precio Orig.</th>
              <th style={thStyle}>Precio Oferta</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Estado</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} style={rowStyle}>
                <td style={{ padding: '14px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px', fontWeight: 700, color: '#111827' }}>{item.name}</td>
                <td style={{ padding: '14px', color: '#374151' }}>{item.sku}</td>
                <td style={{ padding: '14px', color: nearExpiration(item.expirationDate) ? '#DC2626' : '#374151', fontWeight: nearExpiration(item.expirationDate) ? 700 : 600 }}>
                  {new Date(item.expirationDate).toLocaleDateString('es-ES')}
                  {expiredDate(item.expirationDate) && <span style={{ marginLeft: '6px', color: '#DC2626', fontWeight: 700 }}>(Vencido)</span>}
                </td>
                <td style={{ padding: '14px', color: '#6B7280' }}>{item.priceOriginal.toFixed(2)}€</td>
                <td style={{ padding: '14px', color: '#047857', fontWeight: 700 }}>{item.priceOffer.toFixed(2)}€</td>
                <td style={{ padding: '14px', fontWeight: 700, color: item.stock > 0 ? '#111827' : '#9CA3AF' }}>{item.stock}</td>
                <td style={{ padding: '14px' }}>
                  <span style={badgeStyle(item.status)}>{item.status}</span>
                </td>
                <td style={{ padding: '14px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px', textAlign: 'center' }}>
                  <button
                    style={{ marginRight: '8px', padding: '8px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => alert(`Editar ${item.name}`)}
                  >
                    Editar
                  </button>
                  <button
                    style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#B91C1C', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => alert(`Eliminar ${item.name}`)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '12px 0 20px' }}>
          <button
            style={paginationButtonStyle}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            «
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              style={{ ...paginationButtonStyle, background: page === index + 1 ? '#10B981' : '#FFFFFF', color: page === index + 1 ? '#FFFFFF' : '#111827', borderColor: page === index + 1 ? '#10B981' : '#E5E7EB' }}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            style={paginationButtonStyle}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};
 codex/analyze-this-project-d947pk

export default InventoryManagement;

 master
