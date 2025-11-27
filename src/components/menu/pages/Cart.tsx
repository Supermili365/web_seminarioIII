import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { CartItem as CartItemType, CartStore } from '../../../types/menu.types';
import { Header } from '../../common/Header';
import './menu.css';
import './Cart.css';

// --- Interfaces de Tipado ---

/**
 * El tipo principal para los datos del carrito (un array de secciones de tienda).
 */
type CartData = CartStore[];

// --- Mock Data Tipado ---
const initialCartData: CartData = [
    {
        id: 1,
        store: "Supermercado A",
        items: [
            {
                itemId: 'a1',
                name: "Yogur Griego Natural",
                brand: "Chobani",
                size: "500g",
                expiryDate: "25/10/2024",
                originalPrice: 5.00,
                salePrice: 2.50,
                quantity: 1,
                imageUrl: "https://placehold.co/100x100/e0f0e3/10B981?text=Yogur",
                stock: 5
            },
            {
                itemId: 'a2',
                name: "Pan Integral de Molde",
                brand: "Bimbo",
                size: "700g",
                expiryDate: "23/10/2024",
                originalPrice: 3.50,
                salePrice: 1.75,
                quantity: 2,
                imageUrl: "https://placehold.co/100x100/f5e8d9/52433d?text=Pan",
                stock: 8
            }
        ]
    },
    {
        id: 2,
        store: "Tienda B",
        items: [
            {
                itemId: 'b1',
                name: "Leche Entera",
                brand: "Lala",
                size: "1L",
                expiryDate: "22/10/2024",
                originalPrice: 2.00,
                salePrice: 1.00,
                quantity: 1,
                imageUrl: "https://placehold.co/100x100/fcf1c5/f39c12?text=Leche",
                stock: 3
            }
        ]
    }
];

// --- Subcomponentes ---

const Footer: React.FC = () => (
    <footer className="cart-footer">
        <div className="footer-content">
            <p>© 2025 Expirapp. Todos los derechos reservados.</p>
            <div className="footer-links">
                <button className="footer-link">Ayuda</button>
                <button className="footer-link">Términos</button>
                <button className="footer-link">Privacidad</button>
            </div>
        </div>
    </footer>
);

interface QuantityControlProps {
    quantity: number;
    onIncrease: (itemId: string, type: 'increase') => void;
    onDecrease: (itemId: string, type: 'decrease') => void;
    itemId: string;
    maxStock?: number | null;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, onIncrease, onDecrease, itemId, maxStock }) => (
    <div className="quantity-control">
        <button
            onClick={() => onDecrease(itemId, 'decrease')}
            className="quantity-btn"
            disabled={quantity <= 1}
        >
            <Minus size={16} />
        </button>
        <span className="quantity-display">
            {quantity}
        </span>
        <button
            onClick={() => onIncrease(itemId, 'increase')}
            className="quantity-btn"
            disabled={typeof maxStock === 'number' ? quantity >= maxStock : false}
        >
            <Plus size={16} />
        </button>
    </div>
);

interface CartItemProps {
    item: CartItemType;
    updateQuantity: (itemId: string, type: 'increase' | 'decrease') => void;
    removeItem: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeItem }) => (
    <div className="cart-item">
        {/* Imagen del Producto */}
        <div className="cart-item-image-wrapper">
            <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item-image"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/cccccc/333333?text=Prod';
                }}
            />
        </div>

        {/* Detalles del Producto */}
        <div className="cart-item-details">
            <h4 className="cart-item-title">{item.name}</h4>

            {(item.brand || item.size) && (
                <p className="cart-item-subtitle">
                    {item.brand && <span>Marca: {item.brand}</span>}
                    {item.brand && item.size && <span> • </span>}
                    {item.size && <span>Tamaño: {item.size}</span>}
                </p>
            )}

            <p className="cart-item-expiry">
                Vence el {new Date(item.expiryDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="cart-item-price">
                <span className="price-old">Antes: ${item.originalPrice.toFixed(2)}</span>
                <span className="price-new">Ahora: ${item.salePrice.toFixed(2)}</span>
            </p>
        </div>

        {/* Controles de Cantidad y Eliminar */}
        <div className="cart-item-actions">
            <QuantityControl
                quantity={item.quantity}
                itemId={item.itemId}
                onIncrease={(id, type) => updateQuantity(id, type)}
                onDecrease={(id, type) => updateQuantity(id, type)}
                maxStock={item.stock}
            />
            <button
                onClick={() => removeItem(item.itemId)}
                className="btn-remove"
            >
                <Trash2 size={20} />
            </button>
        </div>
    </div>
);

interface StoreSectionProps {
    section: CartStore;
    updateQuantity: (itemId: string, type: 'increase' | 'decrease') => void;
    removeItem: (itemId: string) => void;
}

const StoreSection: React.FC<StoreSectionProps> = ({ section, updateQuantity, removeItem }) => (
    <div className="store-section">
        <h3 className="store-title">
            Productos de {section.store}
        </h3>
        <div className="store-items">
            {section.items.map((item: CartItemType) => (
                <CartItem
                    key={item.itemId}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                />
            ))}
        </div>
    </div>
);

interface OrderSummaryProps {
    subtotal: number;
    totalDiscount: number;
    totalToPay: number;
    onProceed: () => void;
    hasStockIssues: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, totalDiscount, totalToPay, onProceed, hasStockIssues }) => (
    <div className="order-summary">
        <h3 className="summary-title">
            Resumen del Pedido
        </h3>

        <div className="summary-details">
            <div className="summary-row">
                <span>Subtotal (Precio Original)</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row discount">
                <span>Ahorro Total</span>
                <span>-${totalDiscount.toFixed(2)}</span>
            </div>
        </div>

        <div className="summary-total">
            <span>Total a Pagar</span>
            <span>${totalToPay.toFixed(2)}</span>
        </div>

        <button
            onClick={onProceed}
            className="btn-proceed"
            disabled={hasStockIssues}
        >
            Proceder al Pago
        </button>
    </div>
);

// --- Componente Principal Props ---

interface AppProps {
    cartData?: CartData;
    setCartData?: React.Dispatch<React.SetStateAction<CartData>>;
}

interface StockIssue {
    store: string;
    name: string;
    available: number;
    quantity: number;
}

// --- Componente Principal ---

const Cart: React.FC<AppProps> = ({ cartData: externalCartData, setCartData: externalSetCartData }) => {
    // Usamos el estado local si no se proporcionan props externas (ej. Contexto)
    const [localCartData, setLocalCartData] = useState<CartData>(initialCartData);
    const cartData = externalCartData ?? localCartData;
    const setCartData = externalSetCartData ?? setLocalCartData;

    const navigate = useNavigate();

    const stockIssues = useMemo<StockIssue[]>(() => {
        const issues: StockIssue[] = [];

        cartData.forEach(store => {
            store.items.forEach(item => {
                if (typeof item.stock === 'number' && item.quantity > item.stock) {
                    issues.push({
                        store: store.store,
                        name: item.name,
                        available: item.stock,
                        quantity: item.quantity
                    });
                }
            });
        });

        return issues;
    }, [cartData]);

    // Lógica de cálculo del carrito tipada
    const { subtotal, totalDiscount, totalToPay } = useMemo<{ subtotal: number; totalDiscount: number; totalToPay: number }>(() => {
        let subtotal = 0;
        let totalDiscount = 0;
        let totalToPay = 0;

        cartData.forEach((store: CartStore) => {
            store.items.forEach((item: CartItemType) => {
                const itemSubtotal = item.originalPrice * item.quantity;
                const itemSaleTotal = item.salePrice * item.quantity;

                subtotal += itemSubtotal;
                totalToPay += itemSaleTotal;
                totalDiscount += itemSubtotal - itemSaleTotal;
            });
        });

        return { subtotal, totalDiscount, totalToPay };
    }, [cartData]);


    // Función para actualizar la cantidad
    const updateQuantity = (itemId: string, type: 'increase' | 'decrease') => {
        setCartData(prevData => prevData.map(store => ({
            ...store,
            items: store.items.map(item => {
                if (item.itemId === itemId) {
                    let newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
                    newQuantity = Math.max(1, newQuantity);

                    if (typeof item.stock === 'number') {
                        newQuantity = Math.min(newQuantity, item.stock);
                    }

                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        })));
    };

    // Función para eliminar un artículo
    const removeItem = (itemId: string) => {
        setCartData(prevData => {
            let newData = prevData.map(store => ({
                ...store,
                items: store.items.filter(item => item.itemId !== itemId)
            }));
            // Eliminar tiendas vacías
            return newData.filter(store => store.items.length > 0);
        });
    };

    const handleProceedToPayment = () => {
        if (stockIssues.length > 0) return;
        navigate('/payment');
    };

    // Si el carrito está vacío
    if (cartData.length === 0) {
        return (
            <div className="cart-page">
                <Header />
                <main className="cart-main empty">
                    <div className="empty-cart-card">
                        <ShoppingCart size={48} className="empty-cart-icon" />
                        <h2 className="empty-cart-title">Tu Carrito Está Vacío</h2>
                        <p className="empty-cart-text">Parece que aún no has agregado productos con ofertas cerca de su fecha de caducidad.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-explore"
                        >
                            Explorar Ofertas
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="cart-page">
            <Header />
            <main className="cart-main">
                {/* Título y CTA */}
                <div className="cart-header">
                    <h2 className="cart-page-title">Tu Carrito de Compras</h2>
                </div>

                <div className="cart-layout">
                    {/* Columna de Productos */}
                    <div className="cart-products-column">
                        {cartData.map((section: CartStore) => (
                            <StoreSection
                                key={section.id}
                                section={section}
                                updateQuantity={updateQuantity}
                                removeItem={removeItem}
                            />
                        ))}
                    </div>

                    {/* Columna de Resumen del Pedido */}
                    <div className="cart-summary-column">
                        <OrderSummary
                            subtotal={subtotal}
                            totalDiscount={totalDiscount}
                            totalToPay={totalToPay}
                            onProceed={handleProceedToPayment}
                            hasStockIssues={stockIssues.length > 0}
                        />
                        {stockIssues.length > 0 && (
                            <div className="stock-warning">
                                <strong>Ajusta las cantidades para continuar</strong>
                                <p>Estos productos superan el stock disponible:</p>
                                <ul>
                                    {stockIssues.map(issue => (
                                        <li key={`${issue.store}-${issue.name}`}>
                                            {issue.name} ({issue.store}): {issue.quantity} solicitados, {issue.available} en stock.
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Cart;