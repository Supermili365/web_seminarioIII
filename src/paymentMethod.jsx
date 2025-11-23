import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, CreditCard, ShoppingBag, DollarSign, Edit } from 'lucide-react';

// --- Subcomponentes de Navegación y Encabezado ---

const Header = () => (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto"> 
            <a href="/" className="nav-logo-link">Expirapp</a>
            {/* Componente de barra de progreso/navegación */}
            <nav className="hidden sm:flex text-sm space-x-2 text-gray-500 font-medium">
                <span className="text-gray-400">Envío</span>
                <span>&gt;</span>
                <span className="text-green-600">Pago</span>
                <span>&gt;</span>
                <span className="text-gray-400">Confirmación</span>
            </nav>
        </div>
    </header>
);

const Footer = () => (
    <footer className="w-full bg-white mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center items-center text-sm text-gray-500 gap-x-4 gap-y-2 md:gap-x-8">
            <a href="#" className="hover:text-green-600 px-2">Términos y condiciones</a>
            <a href="#" className="hover:text-green-600 px-2">Política de privacidad</a>
            <a href="#" className="hover:text-green-600 px-2">Ayuda</a>
        </div>
    </footer>
);


// --- Subcomponentes de Contenido Principal ---

/**
 * Tarjeta de opción de pago estilizada (similar a DeliveryOption)
 */
const PaymentOptionCard = ({ id, icon: Icon, title, description, isDisabled = false, isSelected, onSelect, children }) => {
    const baseClasses = "flex flex-col p-5 border-2 rounded-xl transition-all duration-200";
    
    // Clases condicionales basadas en el estado
    const statusClasses = isDisabled
        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
        : isSelected
            ? "bg-green-50 border-green-600 shadow-lg cursor-pointer"
            : "bg-white border-gray-300 hover:border-green-400 cursor-pointer";

    return (
        <div className={`${baseClasses} ${statusClasses}`} onClick={() => !isDisabled && onSelect(id)}>
            <div className="flex items-start justify-between">
                <div className="flex items-start">
                    {/* Icono (Si aplica) */}
                    {Icon && (
                        <div className={`p-1 mr-3 ${isDisabled ? 'text-gray-400' : 'text-green-600'}`}>
                            <Icon size={24} />
                        </div>
                    )}
                    
                    {/* Título de la opción */}
                    <div>
                        <h3 className={`font-semibold text-lg ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>{title}</h3>
                        {description && <p className={`text-sm mt-1 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>}
                    </div>
                </div>

                {/* Radio Button Personalizado (solo visible si no está deshabilitado) */}
                {!isDisabled && (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 
                        ${isSelected ? 'border-green-600 bg-white' : 'border-gray-400'}`}>
                        {isSelected && (
                            <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                        )}
                    </div>
                )}
            </div>

            {/* Contenido adicional (Formulario) */}
            {children && isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    );
};

const CardForm = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Número de tarjeta */}
            <div>
                <label htmlFor="cardNumber" className="text-xs font-medium text-gray-500 block mb-1">
                    Número de tarjeta
                </label>
                <input
                    id="cardNumber"
                    type="text"
                    placeholder="**** **** **** ****"
                    className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-green-500 focus:border-green-500"
                />
            </div>
            
            {/* Nombre del titular */}
            <div>
                <label htmlFor="cardHolder" className="text-xs font-medium text-gray-500 block mb-1">
                    Nombre del titular
                </label>
                <input
                    id="cardHolder"
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-green-500 focus:border-green-500"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm">
            {/* Fecha de vencimiento */}
            <div>
                <label htmlFor="expiry" className="text-xs font-medium text-gray-500 block mb-1">
                    Fecha de vencimiento
                </label>
                <input
                    id="expiry"
                    type="text"
                    placeholder="MM/AA"
                    className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-green-500 focus:border-green-500"
                />
            </div>
            
            {/* CVV */}
            <div>
                <label htmlFor="cvv" className="text-xs font-medium text-gray-500 block mb-1">
                    CVV
                </label>
                <input
                    id="cvv"
                    type="password"
                    placeholder="***"
                    className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-green-500 focus:border-green-500"
                />
            </div>
        </div>

        {/* Mensaje de seguridad */}
        <div className="flex items-center text-sm text-gray-500 pt-2">
            <Lock size={16} className="mr-2" />
            <span>Tu información de pago está segura con nosotros.</span>
        </div>
    </div>
);

/**
 * Componente que muestra el resumen del pedido a la derecha
 */
const OrderSummary = ({ items, subtotal, shipping, taxes, total, onPay, isProcessing }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 sticky top-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 pb-4 border-b border-gray-200 mb-4">
            Tu pedido
        </h3>
        
        {/* Lista de Productos */}
        <div className="space-y-3 text-sm text-gray-600 pb-4 border-b border-gray-100">
            {items.map((item, index) => {
                const lineTotal = (Number(item.price) || 0) * (item.quantity || 1);
                return (
                    <div key={index} className="flex justify-between">
                        <span>{item.name} {item.quantity > 1 ? `x${item.quantity}` : ''} ({item.size})</span>
                        <span>${lineTotal.toFixed(2)}</span>
                    </div>
                );
            })}
            <button className="text-green-600 font-medium text-xs pt-1 flex items-center hover:text-green-700 transition">
                <Edit size={14} className="mr-1" />
                <a href="/cart" className="nav-link">Editar carrito</a>
            </button>
        </div>

        {/* Desglose de Precios */}
        <div className="space-y-2 text-sm text-gray-600 mt-4 pb-4 border-b border-gray-100">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Envío</span>
                <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Impuestos</span>
                <span>${taxes.toFixed(2)}</span>
            </div>
        </div>

        {/* Total Final */}
        <div className="mt-4 pt-4 flex justify-between items-center text-xl font-bold text-gray-800">
            <span>Total</span>
            <span>${total.toFixed(3)}</span>
        </div>

        {/* Botón de Pago */}
        <button
            onClick={onPay}
            disabled={isProcessing}
            className={`w-full mt-6 py-3 font-semibold rounded-lg shadow-lg transition duration-150
                ${isProcessing ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
            {isProcessing ? 'Procesando...' : 'Pagar ahora'}
        </button>
    </div>
);


// --- Componente Principal ---

const PaymentMethod = ({ cartData = [], setCartData }) => {
    // Estado para la opción de pago seleccionada
    const [selectedPayment, setSelectedPayment] = useState('card'); 
    // Leer la opción de entrega seleccionada (si viene desde /payment)
    const location = useLocation();
    const selectedDelivery = location?.state?.selectedOption || null;
    const navigate = useNavigate();

    // Estado para manejo de petición de orden
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(null);

    // Función para enviar la orden al backend
    const postOrder = async () => {
        setIsProcessing(true);
        setOrderError(null);
        try {
            const payload = {
                id_cliente: 1,
                id_tienda: 1,
                fecha_compra: new Date().toISOString(),
            };

            const res = await fetch('http://localhost:8081/api/v1/orders/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `HTTP ${res.status}`);
            }

            const data = await res.json().catch(() => null);
                // Mostrar modal de éxito con la respuesta del servidor
                setOrderSuccess(data ?? { message: 'Orden creada correctamente' });
        } catch (err) {
            console.error('Error creando orden:', err);
            setOrderError(err.message || 'Error desconocido');
        } finally {
            setIsProcessing(false);
        }
    };

    // Construir resumen dinámico a partir del carrito pasado desde App
    // `cartData` tiene la forma: [ { store, items: [ { itemId, name, salePrice, quantity, size } ] } ]
    const flattenedItems = (cartData || []).flatMap(store => (
        (store.items || []).map(i => ({
            name: i.name,
            size: i.size || '',
            price: Number(i.salePrice ?? i.salePrice ?? i.salePrice) || Number(i.salePrice ?? i.price ?? 0),
            quantity: i.quantity ?? 1,
        }))
    ));

    const subtotal = flattenedItems.reduce((s, it) => s + (Number(it.price) * (it.quantity || 1)), 0);

    // Si la opción de entrega seleccionada es 'pickup' (Recoger en tienda), envío = 0
    const shipping = selectedDelivery === 'pickup' ? 0 : (subtotal > 0 ? 5000 : 0);

    // Usar tasa de impuestos aproximada del mock original (~19%)
    const taxes = +(subtotal * 0.19);

    const total = +(subtotal + shipping + taxes);

    return (
        <div className="min-h-screen bg-gray-50 font-sans w-full flex flex-col">
            <Header />

            <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna de Método de Pago */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">
                            Elige tu método de pago
                        </h2>
                        {/* Opciones de Pago */}
                        <div className="flex flex-col space-y-4">
                            {/* 1. Tarjeta de crédito/débito */}
                            <PaymentOptionCard
                                id="card"
                                icon={CreditCard}
                                title="Tarjeta de crédito/débito"
                                isSelected={selectedPayment === 'card'}
                                onSelect={setSelectedPayment}
                            >
                                {/* Formulario que solo se muestra cuando está seleccionado */}
                                <CardForm />
                            </PaymentOptionCard>
                            <rb></rb>
                            {/* 2. PSE */}
                            <PaymentOptionCard
                                id="pse"
                                icon={DollarSign}
                                title="PSE"
                                description="Serás redirigido a la pasarela de pago de PSE."
                                isSelected={selectedPayment === 'pse'}
                                onSelect={setSelectedPayment}
                            />
                            <rb></rb>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setOrderSuccess(null)}></div>
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full z-10 p-6 mx-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Compra completada</h3>
                        <p className="text-sm text-gray-600 mb-4">{orderSuccess.message || 'Tu orden se ha creado correctamente.'}</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    // limpiar estado y volver al inicio
                                    setOrderSuccess(null);
                                    if (typeof setCartData === 'function') setCartData([]);
                                    navigate('/');
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {orderError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setOrderError(null)}></div>
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full z-10 p-6 mx-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al procesar la compra</h3>
                        <p className="text-sm text-gray-600 mb-4">{orderError}</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setOrderError(null);
                                }}
                                className="px-4 py-2 border rounded-md font-medium hover:bg-gray-50"
                                disabled={isProcessing}
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={() => postOrder()}
                                className={`px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Procesando...' : 'Intentar de nuevo'}
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