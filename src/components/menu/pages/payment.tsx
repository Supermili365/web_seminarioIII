import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Store, LucideIcon } from 'lucide-react';

// --- Interfaces de Tipado ---

/**
 * Define la estructura de una opción de entrega.
 * El icono es de tipo LucideIcon, que es lo que exporta 'lucide-react'.
 */
interface DeliveryOptionData {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    isDisabled: boolean;
}

/**
 * Props para el componente DeliveryOption.
 */
interface DeliveryOptionProps extends DeliveryOptionData {
    isSelected: boolean;
    onSelect: (id: string) => void;
}

// --- Subcomponentes ---

const Header: React.FC = () => (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-center w-full max-w-7xl mx-auto"> 
            {/* Usamos un enlace simple para simular la navegación, ajustado con clases de Tailwind */}
            <a href="/" className="nav-logo-link font-bold text-xl text-green-600">Expirapp</a>
        </div>
    </header>
);

/**
 * Componente que representa una opción de método de entrega/recogida.
 */
const DeliveryOption: React.FC<DeliveryOptionProps> = ({ 
    id, 
    icon: Icon, 
    title, 
    description, 
    isDisabled, 
    isSelected, 
    onSelect 
}) => {
    const baseClasses = "flex items-center justify-between p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer";
    
    // Clases condicionales basadas en el estado
    const statusClasses = isDisabled
        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-70"
        : isSelected
            ? "bg-green-50 border-green-600 shadow-lg ring-4 ring-green-100"
            : "bg-white border-gray-300 hover:border-green-400 hover:shadow-md";

    return (
        <label
            htmlFor={id}
            className={`${baseClasses} ${statusClasses} mb-4`}
            onClick={() => !isDisabled && onSelect(id)}
        >
            <div className="flex items-start">
                {/* Icono */}
                <div className={`p-3 rounded-full mr-4 flex-shrink-0 
                    ${isDisabled ? 'bg-gray-300' : 'bg-green-100 text-green-600'}`}>
                    <Icon size={24} />
                </div>
                
                {/* Texto de la opción */}
                <div className="flex flex-col justify-start">
                    <h3 className={`font-semibold text-lg ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>{title}</h3>
                    <p className={`text-sm mt-1 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
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
            
            {/* El input radio real, oculto */}
            <input 
                type="radio"
                id={id}
                name="delivery_method"
                value={id}
                checked={isSelected}
                onChange={() => onSelect(id)}
                disabled={isDisabled}
                className="sr-only" // Ocultar visualmente
            />
        </label>
    );
};


// --- Componente Principal ---

const Payment: React.FC = () => {
    // Estado para la opción de entrega seleccionada
    const [selectedOption, setSelectedOption] = useState<string>('pickup'); 

    // Opciones de entrega (datos simulados tipados)
    const options: DeliveryOptionData[] = [
        {
            id: 'pickup',
            icon: Store,
            title: "Recoger en tienda",
            description: "Recoge tu pedido sin costo adicional en el punto de venta.",
            isDisabled: false,
        },
        {
            id: 'home_delivery_A',
            icon: Truck,
            title: "Envío a domicilio Estándar",
            description: "Recíbelo en la comodidad de tu casa. Tarifa: $5000",
            isDisabled: false,
        },
        {
            id: 'home_delivery_B',
            icon: Truck,
            title: "Envío no disponible",
            description: "Esta tienda no ofrece envío a domicilio para este pedido.",
            isDisabled: true,
        }
    ];

    const navigate = useNavigate();

    // Función para manejar la selección de una opción
    const handleSelect = (id: string) => {
        const option = options.find(opt => opt.id === id);
        if (option && !option.isDisabled) {
            setSelectedOption(id);
        }
    };

    // Determina si el botón Continuar debe estar habilitado
    const isContinueEnabled = !!selectedOption && 
                              options.some(opt => opt.id === selectedOption && !opt.isDisabled);


    return (
        <div className="min-h-screen bg-gray-50 font-sans w-full flex flex-col">
            <Header />

            <main className="flex-grow max-w-xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                
                {/* Título */}
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 sm:mb-12">
                    Elige cómo recibir tu pedido
                </h2>

                {/* Lista de Opciones */}
                <div className="flex flex-col">
                    {options.map((option) => (
                        <DeliveryOption
                            key={option.id}
                            {...option}
                            isSelected={selectedOption === option.id}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>

                {/* Botón Continuar */}
                <div className="mt-8">
                    <button
                        className={`w-full py-4 font-semibold rounded-xl shadow-lg transition duration-150
                            ${isContinueEnabled
                                ? 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-80'
                            }
                        `}
                        disabled={!isContinueEnabled}
                        onClick={() => { 
                            // Navegar a la selección de método de pago y pasar la opción seleccionada
                            if (isContinueEnabled) {
                                navigate('/payment/method', { state: { selectedOption } });
                            }
                        }}
                    >
                        Continuar
                    </button>
                </div>

                {/* Espacio para asegurar que el contenido no quede pegado al fondo */}
                <div className="h-16"></div> 
            </main>
        </div>
    );
};

export default Payment;