import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, CreditCard, ShoppingBag, DollarSign, Edit, LucideIcon } from 'lucide-react';
import './PaymentMethod.css';

import { CartItem, CartStore } from '../../../types/menu.types';

// --- Interfaces de Tipado ---

interface PaymentMethodProps {
    cartData?: CartStore[];
    // La función para limpiar el carrito (si se pasa desde el componente App)
    setCartData: React.Dispatch<React.SetStateAction<CartStore[]>>;
}

interface FlattenedItem {
    name: string;
    size: string;
    price: number;
    quantity: number;
}

interface PaymentOptionCardProps {
    id: string;
    icon: LucideIcon;
    title: string;
    description?: string;
    isDisabled?: boolean;
    isSelected: boolean;
    onSelect: (id: string) => void;
    children?: React.ReactNode;
}

interface OrderSummaryProps {
    items: FlattenedItem[];
    subtotal: number;
    shipping: number;
    taxes: number;
    total: number;
    onPay: () => Promise<void>;
    isProcessing: boolean;
}

interface OrderSuccessData {
    orderId?: number;
    message: string;
    // Incluye cualquier otro dato que el API pueda retornar (e.g., código de seguimiento)
}


// --- Subcomponentes de Navegación y Encabezado ---

const Header: React.FC = () => (
    <header className="payment-method-header">
        <div className="header-content">
            <Link to="/" className="nav-logo-link">Expirapp</Link>
            {/* Componente de barra de progreso/navegación */}
            <nav className="nav-breadcrumbs">
                <span className="breadcrumb-item">Envío</span>
                <span>&gt;</span>
                <span className="breadcrumb-item breadcrumb-active">Pago</span>
                <span>&gt;</span>
                <span className="breadcrumb-item">Confirmación</span>
            </nav>
        </div>
    </header>
);

const Footer: React.FC = () => (
    <footer className="payment-footer">
        <div className="footer-content">
            <button className="footer-link">Terminos y condiciones </button>
            <button className="footer-link">Politica de privacidad</button>
            <button className="footer-link">Ayuda</button>
        </div>
    </footer>
);


// --- Subcomponentes de Contenido Principal ---

/**
 * Tarjeta de opción de pago estilizada
 */
const PaymentOptionCard: React.FC<PaymentOptionCardProps> = ({
    id,
    icon: Icon,
    title,
    description,
    isDisabled = false,
    isSelected,
    onSelect,
    children
}) => {
    return (
        <div
            className={`payment-option-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
            onClick={() => !isDisabled && onSelect(id)}
        >
            <div className="card-header">
                <div className="card-content-wrapper">
                    {/* Icono */}
                    {Icon && (
                        <div className="card-icon-wrapper">
                            <Icon size={24} />
                        </div>
                    )}

                    {/* Título de la opción */}
                    <div className="card-text">
                        <h3 className="card-title">{title}</h3>
                        {description && <p className="card-description">{description}</p>}
                    </div>
                </div>

                {/* Radio Button Personalizado */}
                {!isDisabled && (
                    <div className="card-radio">
                        {isSelected && (
                            <div className="card-radio-inner"></div>
                        )}
                    </div>
                )}
            </div>

            {/* Contenido adicional (Formulario) */}
            {children && isSelected && (
                <div className="card-form-container">
                    {children}
                </div>
            )}
        </div>
    );
};

const CardForm: React.FC = () => (
    <div className="form-grid">
        <div className="form-row">
            {/* Número de tarjeta */}
            <div className="form-group">
                <label htmlFor="cardNumber" className="form-label">
                    Número de tarjeta
                </label>
                <input
                    id="cardNumber"
                    type="text"
                    placeholder="**** **** **** ****"
                    className="form-input"
                />
            </div>

            {/* Nombre del titular */}
            <div className="form-group">
                <label htmlFor="cardHolder" className="form-label">
                    Nombre del titular
                </label>
                <input
                    id="cardHolder"
                    type="text"
                    placeholder="Nombre completo"
                    className="form-input"
                />
            </div>
        </div>

        <div className="form-row">
            {/* Fecha de vencimiento */}
            <div className="form-group">
                <label htmlFor="expiry" className="form-label">
                    Fecha de vencimiento
                </label>
                <input
                    id="expiry"
                    type="text"
                    placeholder="MM/AA"
                    className="form-input"
                />
            </div>

            {/* CVV */}
            <div className="form-group">
                <label htmlFor="cvv" className="form-label">
                    CVV
                </label>
                <input
                    id="cvv"
                    type="password"
                    placeholder="***"
                    className="form-input"
                />
            </div>
        </div>

        {/* Mensaje de seguridad */}
        <div className="security-note">
            <Lock size={16} className="security-icon" />
            <span>Tu información de pago está cifrada y segura.</span>
        </div>
    </div>
);

/**
 * Componente que muestra el resumen del pedido a la derecha
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({
    items,
    subtotal,
    shipping,
    taxes,
    total,
    onPay,
    isProcessing
}) => (
    <div className="summary-card">
        <h3 className="summary-header">
            Tu pedido
        </h3>

        {/* Lista de Productos */}
        <div className="summary-items-list">
            {items.map((item, index) => {
                const lineTotal = item.price * item.quantity;
                return (
                    <div key={index} className="summary-item">
                        <span className="item-name">{item.name} {item.quantity > 1 ? `x${item.quantity}` : ''} ({item.size})</span>
                        <span className="item-price">${lineTotal.toFixed(2)}</span>
                    </div>
                );
            })}
            <button className="btn-edit-cart">
                <Edit size={14} className="mr-1" />
                <a href="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>Editar carrito</a>
            </button>
        </div>

        {/* Desglose de Precios */}
        <div className="summary-costs">
            <div className="cost-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cost-row">
                <span>Envío</span>
                <span className={shipping === 0 ? 'cost-free' : ''}>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                </span>
            </div>
            <div className="cost-row">
                <span>Impuestos (19%)</span>
                <span>${taxes.toFixed(2)}</span>
            </div>
        </div>

        {/* Total Final */}
        <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
        </div>

        {/* Botón de Pago */}
        <button
            onClick={onPay}
            disabled={isProcessing}
            className="btn-pay"
        >
            {isProcessing ? (
                <>
                    <svg className="spinner h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                </>
            ) : 'Pagar ahora'}
        </button>
    </div>
);


// --- Componente Principal ---

const PaymentMethod: React.FC<PaymentMethodProps> = ({ cartData = [], setCartData }) => {
    // Estado para la opción de pago seleccionada
    const [selectedPayment, setSelectedPayment] = useState<string>('card');

    const navigate = useNavigate();

    // Estado para manejo de petición de orden
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState<OrderSuccessData | null>(null);

    // Mapear y aplanar los ítems del carrito
    const flattenedItems: FlattenedItem[] = cartData.flatMap(store => (
        (store.items || []).map(i => ({
            name: i.name,
            size: i.size || 'Unidad',
            // Aseguramos que price sea un número, usando salePrice o 0 si no está definido
            price: Number(i.salePrice) || Number(i.originalPrice) || 0,
            quantity: i.quantity ?? 1,
        }))
    )).filter(item => item.price > 0 && item.quantity > 0);

    // Calcular costos
    const subtotal: number = flattenedItems.reduce((s, it) => s + (it.price * it.quantity), 0);

    // Lógica de Envío: Siempre es recogida en tienda (gratis)
    const shipping: number = 0;

    // Tasa de impuestos
    const TAX_RATE = 0.19;

    const taxes: number = subtotal * TAX_RATE;
    const total: number = subtotal + shipping + taxes;


    // Función para enviar la orden al backend
    const postOrder = async () => {
        // Validación mínima
        if (cartData.length === 0) {
            setOrderError('El carrito está vacío. Por favor, añade productos.');
            return;
        }

        // Obtener ID del cliente desde localStorage
        const userStr = localStorage.getItem('usuario');
        const user = userStr ? JSON.parse(userStr) : null;
        console.log('User from localStorage:', user); // Debug

        // Intentar obtener el ID de varias propiedades posibles
        const id_cliente = user?.id_usuario || user?.id || user?.ID || user?.ClientID;

        if (!id_cliente) {
            console.error('No ClientID found in user object:', user);
            setOrderError('No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.');
            return;
        }

        // Obtener token
        const token = localStorage.getItem('token');
        if (!token) {
            setOrderError('No se encontró sesión activa. Por favor, inicia sesión nuevamente.');
            return;
        }

        setIsProcessing(true);
        setOrderError(null);

        const results: { store: string; success: boolean; orderId?: number; error?: string }[] = [];

        // Iterar sobre cada tienda en el carrito para crear una orden por tienda
        for (const store of cartData) {
            // Calcular totales por tienda
            const storeItems = store.items.map(i => {
                // Lógica robusta para obtener el ProductID
                let numericId = 0;
                if (typeof i.itemId === 'number') {
                    numericId = i.itemId;
                } else if (typeof i.itemId === 'string') {
                    // Intentar parsear directamente
                    const parsed = parseInt(i.itemId, 10);
                    if (!isNaN(parsed)) {
                        numericId = parsed;
                    } else {
                        // Intentar extraer de formato "p-123"
                        const idMatch = i.itemId.match(/p-(\d+)/);
                        if (idMatch) {
                            numericId = parseInt(idMatch[1], 10);
                        }
                    }
                }

                if (!numericId) {
                    console.error('Invalid ProductID for item:', i);
                }

                const unitPrice = Number(i.salePrice) || Number(i.originalPrice) || 0;

                return {
                    ProductID: numericId,
                    Quantity: i.quantity,
                    UnitPrice: unitPrice
                };
            });

            // Filtrar items inválidos si es necesario, o dejar que falle para notar el error
            if (storeItems.some(item => !item.ProductID || item.UnitPrice <= 0)) {
                console.error('Invalid items detected:', storeItems);
                results.push({ store: store.store, success: false, error: 'Datos de productos inválidos (ID o Precio).' });
                continue;
            }

            const storeSubtotal = storeItems.reduce((sum, item) => sum + (item.UnitPrice * item.Quantity), 0);
            const storeShipping = 0; // Siempre 0 por recogida
            const storeTaxes = storeSubtotal * 0.19;
            const storeTotal = storeSubtotal + storeShipping + storeTaxes;

            // Log IDs to debug int4 overflow
            console.log(`Debug IDs - ClientID: ${id_cliente} (type: ${typeof id_cliente}), StoreID: ${store.id} (type: ${typeof store.id})`);

            const payload = {
                client_id: id_cliente,
                store_id: store.id,
                payment_method: selectedPayment,
                items: storeItems.map(item => ({
                    product_id: item.ProductID,
                    quantity: item.Quantity,
                    unit_price: item.UnitPrice
                }))
            };

            console.log('Sending Payload:', JSON.stringify(payload, null, 2)); // Debug

            try {
                const res = await fetch('/api/v1/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    throw new Error(`Error ${res.status}: ${text}`);
                }

                const data = await res.json().catch(() => ({}));
                results.push({ store: store.store, success: true, orderId: data.orderId || data.id });

            } catch (err: any) {
                console.error(`Error creando orden para tienda ${store.store}:`, err);
                results.push({ store: store.store, success: false, error: err.message });
            }
        }

        setIsProcessing(false);

        // Evaluar resultados
        const failures = results.filter(r => !r.success);
        const successes = results.filter(r => r.success);

        if (failures.length > 0) {
            const errorMsg = failures.map(f => `${f.store}: ${f.error}`).join('; ');
            setOrderError(`Hubo problemas con algunas tiendas: ${errorMsg}`);
            if (successes.length > 0) {
                setOrderSuccess({ message: `Se crearon órdenes para: ${successes.map(s => s.store).join(', ')}. Pero fallaron: ${failures.map(f => f.store).join(', ')}.` });
            }
        } else {
            const orderIds = successes.map(s => s.orderId).filter(Boolean).join(', ');
            setOrderSuccess({
                message: '¡Todas las órdenes se crearon exitosamente!',
                orderId: orderIds ? parseInt(orderIds) : undefined
            });
        }
    };

    return (
        <div className="payment-method-page">
            <Header />

            <main className="payment-method-container">

                <div className="payment-layout">
                    {/* Columna de Método de Pago */}
                    <div className="payment-options-column">
                        <h2 className="section-title">
                            Elige tu método de pago
                        </h2>

                        {/* NOTA: Se eliminó la selección de entrega, siempre es recogida en tienda */}

                        {/* Opciones de Pago */}
                        <div className="payment-options-list">
                            {/* 1. Tarjeta de crédito/débito */}
                            <PaymentOptionCard
                                id="card"
                                icon={CreditCard}
                                title="Tarjeta de crédito/débito"
                                description="Paga de forma rápida y segura."
                                isSelected={selectedPayment === 'card'}
                                onSelect={setSelectedPayment}
                            >
                                <CardForm />
                            </PaymentOptionCard>

                            {/* 2. PSE */}
                            <PaymentOptionCard
                                id="pse"
                                icon={DollarSign}
                                title="PSE (Pago Seguro en Línea)"
                                description="Serás redirigido a tu entidad bancaria para completar la transacción."
                                isSelected={selectedPayment === 'pse'}
                                onSelect={setSelectedPayment}
                            />

                            {/* 3. Pago contra entrega */}
                            <PaymentOptionCard
                                id="cod"
                                icon={ShoppingBag}
                                title="Pago contra entrega"
                                description="Paga en efectivo o con tarjeta al recibir tu pedido."
                                isSelected={selectedPayment === 'cod'}
                                onSelect={setSelectedPayment}
                            />
                        </div>
                    </div>

                    {/* Columna de Resumen del Pedido */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            items={flattenedItems}
                            subtotal={subtotal}
                            shipping={shipping}
                            taxes={taxes}
                            total={total}
                            onPay={postOrder}
                            isProcessing={isProcessing}
                        />
                    </div>
                </div>
            </main>

            {/* Modales de éxito / error */}
            {orderSuccess && (
                <div className="modal-overlay">
                    <div className="modal-backdrop" onClick={() => setOrderSuccess(null)}></div>
                    <div className="modal-content">
                        <div className="modal-icon-wrapper success">
                            <Lock size={28} />
                        </div>
                        <h3 className="modal-title">¡Compra Exitosa!</h3>
                        <p className="modal-message">
                            {orderSuccess.message || 'Tu orden se ha creado correctamente. Revisa tu correo electrónico para el resumen.'}
                        </p>

                        <div className="modal-actions">
                            {orderSuccess.orderId && (
                                <p className="order-id">
                                    N° de Orden: <span>{orderSuccess.orderId}</span>
                                </p>
                            )}
                            <button
                                onClick={() => {
                                    setOrderSuccess(null);
                                    if (typeof setCartData === 'function') setCartData([]);
                                    navigate('/');
                                }}
                                className="btn-modal-primary"
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {orderError && (
                <div className="modal-overlay">
                    <div className="modal-backdrop" onClick={() => setOrderError(null)}></div>
                    <div className="modal-content">
                        <div className="modal-icon-wrapper error">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.021 3.376 1.87 3.376H17.48c1.849 0 2.736-1.876 1.87-3.376L12.18 5.75c-.866-1.5-3.033-1.5-3.898 0L2.697 16.126zM12 15.75h.007" />
                            </svg>
                        </div>
                        <h3 className="modal-title">Error de Pago</h3>
                        <p className="modal-message">Ocurrió un problema: {orderError}</p>
                        <div className="modal-actions-row">
                            <button
                                onClick={() => setOrderError(null)}
                                className="btn-modal-secondary"
                                disabled={isProcessing}
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={postOrder}
                                className="btn-modal-primary"
                                style={{ width: 'auto', padding: '0.5rem 1rem' }}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Reintentando...' : 'Intentar de nuevo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default PaymentMethod;