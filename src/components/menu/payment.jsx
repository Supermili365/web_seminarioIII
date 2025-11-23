import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Home, Store } from 'lucide-react';

// --- Subcomponentes ---

const Header = () => (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-center w-full max-w-7xl mx-auto"> 
            <a href="/" className="nav-logo-link">Expirapp</a>
        </div>
    </header>
);

/**
 * Componente que representa una opción de método de entrega/recogida.
 */
const DeliveryOption = ({ id, icon: Icon, title, description, isDisabled, isSelected, onSelect }) => {
    const baseClasses = "flex items-center justify-between p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer";
    
    // Clases condicionales basadas en el estado
    const statusClasses = isDisabled
        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
        : isSelected
            ? "bg-green-50 border-green-600 shadow-lg"
            : "bg-white border-gray-300 hover:border-green-400";

    return (
        <label
            htmlFor={id}
            className={`${baseClasses} ${statusClasses} mb-4`}
            onClick={() => !isDisabled && onSelect(id)}
        >
            <div className="flex items-start">
                {/* Icono */}
                <div className={`p-3 rounded-full mr-4 ${isDisabled ? 'bg-gray-300' : 'bg-green-100 text-green-600'}`}>
                    <Icon size={24} />
                </div>
                
                {/* Texto de la opción */}
                <div>
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

const App = () => {
    // Estado para la opción de entrega seleccionada
    const [selectedOption, setSelectedOption] = useState('pickup'); 

    // Opciones de entrega (datos simulados)
    const options = [
        {
            id: 'pickup',
            icon: Store,
            title: "Recoger en tienda",
            description: "Recoge tu pedido sin costo adicional",
            isDisabled: false,
        },
        {
            id: 'home_delivery_A',
            icon: Truck,
            title: "Envío a domicilio",
            description: "Recíbelo en la comodidad de tu casa",
            isDisabled: false,
        },
        {
            id: 'home_delivery_B',
            icon: Truck,
            title: "Envío a domicilio",
            description: "Esta tienda no ofrece envío a domicilio",
            isDisabled: true,
        }
    ];

    const navigate = useNavigate();

    // Determina si el botón Continuar debe estar habilitado
    const isContinueEnabled = !!selectedOption && 
                             options.find(opt => opt.id === selectedOption && !opt.isDisabled);


    return (
        <div className="min-h-screen bg-white font-sans w-full flex flex-col">
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
                            id={option.id}
                            icon={option.icon}
                            title={option.title}
                            description={option.description}
                            isDisabled={option.isDisabled}
                            isSelected={selectedOption === option.id}
                            onSelect={setSelectedOption}
                        />
                    ))}
                </div>

                {/* Botón Continuar */}
                <div className="mt-8">
                    <button
                        className={`w-full py-4 font-semibold rounded-lg shadow-md transition duration-150
                            ${isContinueEnabled
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
                        `}
                        disabled={!isContinueEnabled}
                        onClick={() => { 
                                // Navegar a la selección de método de pago y pasar la opción seleccionada
                                navigate('/payment/method', { state: { selectedOption } });
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

export default App;