import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Trash2, Minus, Plus } from 'lucide-react';

// --- Interfaces de Tipado ---

/**
 * Define la estructura de un artículo individual en el carrito.
 */
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

/**
 * Define una sección del carrito agrupada por tienda.
 */
interface StoreSectionData {
    id: number;
    store: string;
    items: CartItem[];
}

/**
 * El tipo principal para los datos del carrito (un array de secciones de tienda).
 */
type CartData = StoreSectionData[];

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
                imageUrl: "https://placehold.co/100x100/e0f0e3/10B981?text=Yogur"
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
                imageUrl: "https://placehold.co/100x100/f5e8d9/52433d?text=Pan"
            }
        ]
    },
    {
        id: 2,
        store: "Tienda B",
        items: [
            {
                itemId: 'b1',
                name: "Leche Fresca Entera",
                brand: "Lala",
                size: "1L",
                expiryDate: "22/10/2024",
                originalPrice: 2.00,
                salePrice: 1.00,
                quantity: 1,
                imageUrl: "https://placehold.co/100x100/fcf1c5/f39c12?text=Leche"
            }
        ]
    }
];

// --- Subcomponentes Props ---

interface QuantityControlProps {
    quantity: number;
    onIncrease: (itemId: string, type: 'increase') => void;
    onDecrease: (itemId: string, type: 'decrease') => void;
    itemId: string;
}

interface CartItemProps {
    item: CartItem;
    updateQuantity: (itemId: string, type: 'increase' | 'decrease') => void;
    removeItem: (itemId: string) => void;
}

interface StoreSectionProps {
    section: StoreSectionData;
    updateQuantity: (itemId: string, type: 'increase' | 'decrease') => void;
    removeItem: (itemId: string) => void;
}

interface OrderSummaryProps {
    subtotal: number;
    totalDiscount: number;
    totalToPay: number;
    onProceed: () => void;
}

// --- Subcomponentes ---

const Header: React.FC = () => (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto"> 
            <div className="flex items-center space-x-2">
                <a href="/" className="nav-logo-link font-bold text-xl text-green-600">Expirapp</a>
            </div>
            <div className="flex items-center space-x-4">
                {/* Ícono de Usuario */}
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <User size={20} />
                </button>
            </div>
        </div>
    </header>
);

const Footer: React.FC = () => (
    <footer className="w-full bg-gray-100 mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 Expirapp. Todos los derechos reservados.</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 md:mt-0">
                <a href="#" className="hover:text-green-600 px-2">Ayuda</a>
                <a href="#" className="hover:text-green-600 px-2">Términos</a>
                <a href="#" className="hover:text-green-600 px-2">Privacidad</a>
            </div>
        </div>
    </footer>
);

const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, onIncrease, onDecrease, itemId }) => (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9">
        <button
            onClick={() => onDecrease(itemId, 'decrease')}
            className="p-2 w-8 h-full text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
            disabled={quantity <= 1}
        >
            <Minus size={16} />
        </button>
        <span className="w-8 text-center text-sm font-medium text-gray-800 border-x border-gray-300 flex items-center justify-center h-full select-none">
            {quantity}
        </span>
        <button
            onClick={() => onIncrease(itemId, 'increase')}
            className="p-2 w-8 h-full text-gray-600 hover:bg-gray-100 transition"
        >
            <Plus size={16} />
        </button>
    </div>
);

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeItem }) => (
    <div className="flex items-center py-4 border-b border-gray-100 last:border-b-0">
        {/* Imagen del Producto */}
        <div className="w-20 h-20 flex-shrink-0 mr-4 rounded-lg overflow-hidden bg-gray-100">
            <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover" 
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                    (e.target as HTMLImageElement).onerror = null; 
                    (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/cccccc/333333?text=Prod'; 
                }}
            />
        </div>

        {/* Detalles del Producto */}
        <div className="flex-grow min-w-0 pr-4">
            <h4 className="font-semibold text-gray-800 text-base leading-snug">{item.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">
                Marca: {item.brand}, Tamaño: {item.size}
            </p>
            <p className="text-xs text-red-500 font-medium mt-0.5">
                Vence el {item.expiryDate}
            </p>
            <p className="mt-1 text-sm">
                <span className="line-through text-gray-400 mr-2">Antes: ${item.originalPrice.toFixed(2)}</span>
                <span className="font-bold text-green-600">Ahora: ${item.salePrice.toFixed(2)}</span>
            </p>
        </div>

        {/* Controles de Cantidad y Eliminar */}
        <div className="flex flex-col items-end space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <QuantityControl
                quantity={item.quantity}
                itemId={item.itemId}
                onIncrease={(id, type) => updateQuantity(id, type)}
                onDecrease={(id, type) => updateQuantity(id, type)}
            />
            <button 
                onClick={() => removeItem(item.itemId)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
                <Trash2 size={20} />
            </button>
        </div>
    </div>
);

const StoreSection: React.FC<StoreSectionProps> = ({ section, updateQuantity, removeItem }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-3 mb-4">
            Productos de {section.store}
        </h3>
        <div className="divide-y divide-gray-100">
            {section.items.map((item: CartItem) => (
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

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, totalDiscount, totalToPay, onProceed }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
        <h3 className="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-100 mb-4">
            Resumen del Pedido
        </h3>
        
        <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
                <span>Subtotal (Precio Original)</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-green-600">
                <span>Ahorro Total</span>
                <span>-${totalDiscount.toFixed(2)}</span>
            </div>
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center text-xl font-bold text-gray-800">
            <span>Total a Pagar</span>
            <span>${totalToPay.toFixed(2)}</span>
        </div>

        <button 
            onClick={onProceed} 
            className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition duration-150"
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

// --- Componente Principal ---

const Cart: React.FC<AppProps> = ({ cartData: externalCartData, setCartData: externalSetCartData }) => {
    // Usamos el estado local si no se proporcionan props externas (ej. Contexto)
    const [localCartData, setLocalCartData] = useState<CartData>(initialCartData);
    const cartData = externalCartData ?? localCartData;
    const setCartData = externalSetCartData ?? setLocalCartData;
    
    const navigate = useNavigate();

    // Lógica de cálculo del carrito tipada
    const { subtotal, totalDiscount, totalToPay } = useMemo<{ subtotal: number; totalDiscount: number; totalToPay: number }>(() => {
        let subtotal = 0;
        let totalDiscount = 0;
        let totalToPay = 0;

        cartData.forEach((store: StoreSectionData) => {
            store.items.forEach((item: CartItem) => {
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
                    const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
                    // La cantidad mínima es 1
                    return { ...item, quantity: Math.max(1, newQuantity) }; 
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
    
    // Si el carrito está vacío
    if (cartData.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans w-full flex flex-col">
                <Header/>
                <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                    <div className="text-center p-12 bg-white rounded-xl shadow-xl">
                        <Trash2 size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">Tu Carrito Está Vacío</h2>
                        <p className="text-gray-500 mb-6">Parece que aún no has agregado productos con ofertas cerca de su fecha de caducidad.</p>
                        <button 
                            onClick={() => navigate('/')} 
                            className="py-2 px-6 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition duration-150"
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
        <div className="min-h-screen bg-gray-50 font-sans w-full flex flex-col">
            <Header/>
            <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                {/* Título y CTA */}
                <div className="flex justify-between items-baseline mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Tu Carrito de Compras</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna de Productos */}
                    <div className="lg:col-span-2">
                        {cartData.map((section: StoreSectionData) => (
                            <StoreSection 
                                key={section.id} 
                                section={section}
                                updateQuantity={updateQuantity}
                                removeItem={removeItem}
                            />
                        ))}
                    </div>

                    {/* Columna de Resumen del Pedido */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            subtotal={subtotal}
                            totalDiscount={totalDiscount}
                            totalToPay={totalToPay}
                            onProceed={() => navigate('/payment')}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Cart;