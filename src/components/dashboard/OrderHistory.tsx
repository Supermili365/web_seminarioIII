import React, { useMemo, useState } from 'react';
import { CheckCircle, Clock, ClipboardList } from 'lucide-react';

type OrderStatus = 'En preparación' | 'Listo para recoger' | 'Entregado';

interface Order {
  id: number;
  code: string;
  store: string;
  total: number;
  date: string;
  pickupTime: string;
  status: OrderStatus;
}

interface OrderHistoryProps {
  onNavigate: (view: string) => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ onNavigate }) => {
  const [statusFilter, setStatusFilter] = useState<'todos' | OrderStatus>('todos');
  const [page, setPage] = useState(1);

  const orders = useMemo<Order[]>(() => (
    [
      {
        id: 1,
        code: 'Pedido #123456',
        store: 'Supermercado El Ahorro',
        total: 12.5,
        date: '2023-10-15',
        pickupTime: '14:30',
        status: 'En preparación',
      },
      {
        id: 2,
        code: 'Pedido #123457',
        store: 'Supermercado La Confianza',
        total: 25.75,
        date: '2023-10-16',
        pickupTime: '12:15',
        status: 'Entregado',
      },
      {
        id: 3,
        code: 'Pedido #123458',
        store: 'Mercado Fresco',
        total: 8.8,
        date: '2023-10-17',
        pickupTime: '18:45',
        status: 'Listo para recoger',
      },
      {
        id: 4,
        code: 'Pedido #123459',
        store: 'Supermercado Central',
        total: 42.15,
        date: '2023-10-18',
        pickupTime: '09:30',
        status: 'En preparación',
      },
      {
        id: 5,
        code: 'Pedido #123460',
        store: 'Mercado de Barrio',
        total: 15.2,
        date: '2023-10-19',
        pickupTime: '10:45',
        status: 'Entregado',
      },
    ]
  ), []);

  const pageSize = 3;

  const filtered = useMemo(() => (
    statusFilter === 'todos' ? orders : orders.filter((order) => order.status === statusFilter)
  ), [orders, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentOrders = filtered.slice((page - 1) * pageSize, page * pageSize);

  const badgeStyle = (status: OrderStatus): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '6px 12px',
      borderRadius: '9999px',
      fontWeight: 700,
      fontSize: '13px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    };

    if (status === 'En preparación') {
      return { ...base, backgroundColor: '#FEF3C7', color: '#92400E' };
    }

    if (status === 'Listo para recoger') {
      return { ...base, backgroundColor: '#DBEAFE', color: '#1D4ED8' };
    }

    return { ...base, backgroundColor: '#DCFCE7', color: '#047857' };
  };

  const renderStatusIcon = (status: OrderStatus) => {
    if (status === 'En preparación') return <Clock size={16} />;
    if (status === 'Listo para recoger') return <ClipboardList size={16} />;
    return <CheckCircle size={16} />;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', padding: '28px 32px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div style={{ color: '#10B981', fontWeight: 800, fontSize: '24px' }}>Expirapp</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => onNavigate('inventory')}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #10B981', background: '#0F172A', color: '#10B981', fontWeight: 700, cursor: 'pointer' }}
          >
            Inventario
          </button>
          <button
            onClick={() => onNavigate('login')}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#0F172A', fontWeight: 700, cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div style={{ background: '#111827', borderRadius: '16px', padding: '20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#E5E7EB' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Historial de Pedidos</h1>
          <p style={{ margin: '4px 0 0', color: '#9CA3AF', fontSize: '14px' }}>Revisa el estado de tus compras y coordina la recogida a tiempo.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['todos', 'En preparación', 'Listo para recoger', 'Entregado'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status as 'todos' | OrderStatus);
                setPage(1);
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #1F2937',
                background: statusFilter === status ? '#10B981' : '#1F2937',
                color: statusFilter === status ? '#FFFFFF' : '#D1D5DB',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {status === 'todos' ? 'Todos' : status}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {currentOrders.map((order) => (
          <div key={order.id} style={{ background: '#111827', borderRadius: '14px', padding: '18px', color: '#E5E7EB', boxShadow: '0 2px 6px rgba(0,0,0,0.25)', display: 'flex', gap: '16px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#1F2937', display: 'grid', placeItems: 'center', color: '#10B981', fontWeight: 800 }}>
              {order.store[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 800, fontSize: '16px' }}>{order.code}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '13px' }}>
                    {new Date(order.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    {` | ${order.pickupTime}`}
                  </span>
                  <span style={{ color: '#D1D5DB', marginTop: '6px' }}>{order.store}</span>
                </div>
                <span style={badgeStyle(order.status)}>
                  {renderStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <div>
                  <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Monto total</span>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#10B981' }}>${order.total.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => alert(`Ver detalles de ${order.code}`)}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #10B981', background: '#0F172A', color: '#10B981', fontWeight: 700, cursor: 'pointer' }}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '18px' }}>
        <button
          style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #1F2937', background: '#111827', color: '#D1D5DB', cursor: 'pointer' }}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          «
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1px solid #1F2937',
              background: page === index + 1 ? '#10B981' : '#111827',
              color: page === index + 1 ? '#FFFFFF' : '#D1D5DB',
              cursor: 'pointer',
            }}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #1F2937', background: '#111827', color: '#D1D5DB', cursor: 'pointer' }}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};
