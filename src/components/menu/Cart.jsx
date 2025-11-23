import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Trash2, Minus, Plus } from 'lucide-react';

// --- Mock Data ---
const initialCartData = [
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

// --- Subcomponentes ---

const Header = () => (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto"> 
            <div className="flex items-center space-x-2">
                    <a href="/" className="nav-logo-link">Expirapp</a>
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

const Footer = () => (
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

const QuantityControl = ({ quantity, onIncrease, onDecrease, itemId }) => (
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

const CartItem = ({ item, updateQuantity, removeItem }) => (
    <div className="flex items-center py-4 border-b border-gray-100 last:border-b-0">
        {/* Imagen del Producto */}
        <div className="w-20 h-20 flex-shrink-0 mr-4 rounded-lg overflow-hidden bg-gray-100">
            <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/cccccc/333333?text=Prod'; }}
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
                onIncrease={updateQuantity}
                onDecrease={updateQuantity}
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

const StoreSection = ({ section, updateQuantity, removeItem }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-3 mb-4">
            Productos de {section.store}
        </h3>
        <div className="divide-y divide-gray-100">
            {section.items.map(item => (
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

const OrderSummary = ({ subtotal, totalDiscount, totalToPay, onProceed }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
        <h3 className="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-100 mb-4">
            Resumen del Pedido
        </h3>
        
        <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
                <span>Subtotal</span>
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

        <button onClick={onProceed} className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150">
            Proceder al Pago
        </button>
    </div>
);

// --- Componente Principal ---

const App = ({ cartData: externalCartData, setCartData: externalSetCartData }) => {
    const [localCartData, setLocalCartData] = useState(initialCartData);
    const cartData = externalCartData ?? localCartData;
    const setCartData = externalSetCartData ?? setLocalCartData;
    const navigate = useNavigate();

    // Lógica de cálculo del carrito
    const { subtotal, totalDiscount, totalToPay } = useMemo(() => {
        let subtotal = 0;
        let totalDiscount = 0;
        let totalToPay = 0;

        cartData.forEach(store => {
            store.items.forEach(item => {
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
    const updateQuantity = (itemId, type = 'increase') => {
        setCartData(prevData => prevData.map(store => ({
            ...store,
            items: store.items.map(item => {
                if (item.itemId === itemId) {
                    const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
                    return { ...item, quantity: Math.max(1, newQuantity) }; // La cantidad mínima es 1
                }
                return item;
            })
        })));
    };

    // Función para eliminar un artículo
    const removeItem = (itemId) => {
        setCartData(prevData => {
            let newData = prevData.map(store => ({
                ...store,
                items: store.items.filter(item => item.itemId !== itemId)
            }));
            // Eliminar tiendas vacías
            return newData.filter(store => store.items.length > 0);
        });
    };
    
    // Si el carrito está vacío, se podría mostrar un mensaje aquí.
    if (cartData.length === 0) {
        
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
                        {cartData.map(section => (
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

export default App;
