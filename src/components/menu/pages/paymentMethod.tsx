import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, CreditCard, ShoppingBag, DollarSign, Edit, LucideIcon } from 'lucide-react';

// --- Interfaces de Tipado ---

interface CartItem {
    itemId: number;
    name: string;
    salePrice: string | number; // Puede venir como string o number
    quantity: number;
    size?: string;
    price?: number;
}

interface StoreData {
    store: string;
    items: CartItem[];
}

interface PaymentMethodProps {
    cartData?: StoreData[];
    // La función para limpiar el carrito (si se pasa desde el componente App)
    setCartData: React.Dispatch<React.SetStateAction<StoreData[]>>; 
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
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto"> 
            <a href="/" className="nav-logo-link font-bold text-xl text-green-600">Expirapp</a>
            {/* Componente de barra de progreso/navegación */}
            <nav className="hidden sm:flex text-sm space-x-2 text-gray-500 font-medium">
                <span className="text-gray-400">Envío</span>
                <span>&gt;</span>
                <span className="text-green-600 font-bold">Pago</span>
                <span>&gt;</span>
                <span className="text-gray-400">Confirmación</span>
            </nav>
        </div>
    </header>
);

const Footer: React.FC = () => (
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
    const baseClasses = "flex flex-col p-5 border-2 rounded-xl transition-all duration-200";
    
    // Clases condicionales basadas en el estado
    const statusClasses = isDisabled
        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-70"
        : isSelected
            ? "bg-green-50 border-green-600 shadow-lg ring-4 ring-green-100 cursor-pointer"
            : "bg-white border-gray-300 hover:border-green-400 hover:shadow-md cursor-pointer";

    return (
        <div className={`${baseClasses} ${statusClasses}`} onClick={() => !isDisabled && onSelect(id)}>
            <div className="flex items-start justify-between">
                <div className="flex items-start">
                    {/* Icono */}
                    {Icon && (
                        <div className={`p-1 mr-3 flex-shrink-0 ${isDisabled ? 'text-gray-400' : 'text-green-600'}`}>
                            <Icon size={24} />
                        </div>
                    )}
                    
                    {/* Título de la opción */}
                    <div className="flex flex-col justify-start">
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
                <div className="mt-4 pt-4 border-t border-gray-100 transition-all duration-300">
                    {children}
                </div>
            )}
        </div>
    );
};

const CardForm: React.FC = () => (
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
            <Lock size={16} className="mr-2 text-green-500" />
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
    <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 sticky top-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 pb-4 border-b border-gray-200 mb-4">
            Tu pedido
        </h3>
        
        {/* Lista de Productos */}
        <div className="space-y-3 text-sm text-gray-600 pb-4 border-b border-gray-100 max-h-40 overflow-y-auto">
            {items.map((item, index) => {
                const lineTotal = item.price * item.quantity;
                return (
                    <div key={index} className="flex justify-between">
                        <span className="truncate pr-2">{item.name} {item.quantity > 1 ? `x${item.quantity}` : ''} ({item.size})</span>
                        <span className="font-medium text-gray-800">${lineTotal.toFixed(2)}</span>
                    </div>
                );
            })}
            <button className="text-green-600 font-medium text-xs pt-2 flex items-center hover:text-green-700 transition">
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
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                </span>
            </div>
            <div className="flex justify-between">
                <span>Impuestos (19%)</span>
                <span>${taxes.toFixed(2)}</span>
            </div>
        </div>

        {/* Total Final */}
        <div className="mt-4 pt-4 flex justify-between items-center text-2xl font-extrabold text-gray-800">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
        </div>

        {/* Botón de Pago */}
        <button
            onClick={onPay}
            disabled={isProcessing}
            className={`w-full mt-6 py-3 font-semibold rounded-xl shadow-lg transition duration-150 transform hover:scale-[1.005]
                ${isProcessing ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-80' : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'}`}
        >
            {isProcessing ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                </span>
            ) : 'Pagar ahora'}
        </button>
    </div>
);


// --- Componente Principal ---

const PaymentMethod: React.FC<PaymentMethodProps> = ({ cartData = [], setCartData }) => {
    // Estado para la opción de pago seleccionada
    const [selectedPayment, setSelectedPayment] = useState<string>('card'); 
    
    // Leer la opción de entrega seleccionada desde la navegación
    const location = useLocation();
    // Tipado inferido como string | undefined | null. Asumimos string si existe.
    const selectedDelivery: string | undefined = (location.state as { selectedOption?: string })?.selectedOption;
    
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
            price: Number(i.salePrice) || Number(i.price) || 0,
            quantity: i.quantity ?? 1,
        }))
    )).filter(item => item.price > 0 && item.quantity > 0);

    // Calcular costos
    const subtotal: number = flattenedItems.reduce((s, it) => s + (it.price * it.quantity), 0);

    // Lógica de Envío: $5.00 por envío a domicilio, gratis si es recogida.
    // Usamos el id de la opción del componente anterior.
    const shippingAmount: number = (selectedDelivery && selectedDelivery.includes('pickup')) ? 0 : 5000;
    const shipping: number = subtotal > 0 ? shippingAmount : 0;

    // Tasa de impuestos
    const TAX_RATE = 0.19;
    const taxes: number = subtotal * TAX_RATE;

    const total: number = subtotal + shipping + taxes;


    // Función para enviar la orden al backend
    const postOrder = async () => {
        // Validación mínima
        if (flattenedItems.length === 0) {
            setOrderError('El carrito está vacío. Por favor, añade productos.');
            return;
        }

        setIsProcessing(true);
        setOrderError(null);
        
        // Simulación de Exponential Backoff para reintentos (aunque solo se ejecuta una vez aquí)
        const MAX_RETRIES = 3;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                // Aquí deberías tener la lógica para obtener id_cliente y id_tienda reales
                const payload = {
                    id_cliente: 12345, // ID simulado
                    id_tienda: 678, // ID simulado (asumiendo que es una orden única)
                    fecha_compra: new Date().toISOString(),
                    metodo_entrega: selectedDelivery,
                    metodo_pago: selectedPayment,
                    total_pedido: total.toFixed(2),
                    items: flattenedItems.map(i => ({
                        item_id: i.name, // Usando nombre como ID temporal
                        cantidad: i.quantity,
                        precio_unitario: i.price,
                    }))
                };

                const res = await fetch('http://localhost:8081/api/v1/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const text = await res.text().catch(() => 'Error de red o servidor.');
                    // Si falla por un error del servidor, intentar de nuevo.
                    if (res.status >= 500 && attempt < MAX_RETRIES - 1) {
                        const delay = Math.pow(2, attempt) * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue; // Reintentar
                    }
                    throw new Error(`Error ${res.status}: ${text || res.statusText}`);
                }

                const data: OrderSuccessData = await res.json().catch(() => ({ message: 'Orden creada, no se recibió confirmación JSON.' }));
                
                // Éxito:
                setOrderSuccess(data);
                setIsProcessing(false);
                return; // Salir de la función al tener éxito

            } catch (err: any) {
                console.error('Error creando orden (Intento ' + (attempt + 1) + '):', err);
                if (attempt === MAX_RETRIES - 1) {
                    setOrderError(err.message || 'Error desconocido al intentar completar el pedido.');
                }
                // Si el error es de cliente (4xx) o el último intento, no reintentar.
                if (err.message && (err.message.includes('Error 4') || attempt === MAX_RETRIES - 1)) {
                    break;
                }
            }
        }
        setIsProcessing(false);
    };

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
                        <br></br>
                        {/* Indicación de Entrega Seleccionada */}
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-800 rounded-md shadow-sm">
                            <p className="font-medium">Modo de Entrega Seleccionado:</p>
                            <p className="pt-1">
                                {selectedDelivery === 'pickup' 
                                    ? 'Recoger en tienda (Sin costo de envío).' 
                                    : 'Envío a domicilio (Se aplica tarifa de envío).'
                                }
                            </p>
                            <button 
                                onClick={() => navigate(-1)} 
                                className="text-blue-600 font-semibold hover:text-blue-700 mt-2 text-xs flex items-center transition"
                            >
                                <Edit size={14} className="mr-1"/> Cambiar opción de entrega
                            </button>
                        </div>
                        <br></br>
                        {/* Opciones de Pago */}
                        <div className="flex flex-col space-y-4">
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
                            <br></br>
                            {/* 2. PSE */}
                            <PaymentOptionCard
                                id="pse"
                                icon={DollarSign}
                                title="PSE (Pago Seguro en Línea)"
                                description="Serás redirigido a tu entidad bancaria para completar la transacción."
                                isSelected={selectedPayment === 'pse'}
                                onSelect={setSelectedPayment}
                            />
                            <br></br>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOrderSuccess(null)}></div>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full z-10 p-6 mx-auto transform transition-all">
                        <div className="flex flex-col items-center">
                            <div className="p-3 bg-green-100 rounded-full mb-4">
                                <Lock size={28} className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">¡Compra Exitosa!</h3>
                            <p className="text-sm text-gray-600 mb-6 text-center">
                                {orderSuccess.message || 'Tu orden se ha creado correctamente. Revisa tu correo electrónico para el resumen.'}
                            </p>
                        </div>
                        
                        <div className="flex flex-col space-y-3">
                            {orderSuccess.orderId && (
                                <p className="text-sm font-medium text-gray-700 text-center">
                                    N° de Orden: <span className="text-green-600 font-bold">{orderSuccess.orderId}</span>
                                </p>
                            )}
                            <button
                                onClick={() => {
                                    setOrderSuccess(null);
                                    if (typeof setCartData === 'function') setCartData([]);
                                    navigate('/');
                                }}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {orderError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOrderError(null)}></div>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full z-10 p-6 mx-auto transform transition-all">
                        <div className="flex flex-col items-center">
                            <div className="p-3 bg-red-100 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-red-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.021 3.376 1.87 3.376H17.48c1.849 0 2.736-1.876 1.87-3.376L12.18 5.75c-.866-1.5-3.033-1.5-3.898 0L2.697 16.126zM12 15.75h.007" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error de Pago</h3>
                            <p className="text-sm text-gray-600 mb-6 text-center">Ocurrió un problema: {orderError}</p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setOrderError(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                                disabled={isProcessing}
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={postOrder}
                                className={`px-4 py-2 text-white rounded-xl font-medium transition ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
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