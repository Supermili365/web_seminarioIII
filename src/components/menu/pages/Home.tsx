import React, { useState } from 'react';
import { Search, SlidersHorizontal, Leaf, Check, DollarSign, MapPin, Heart } from 'lucide-react';
import { Product } from '../../../types/menu.types';
import { Header } from '../../common/Header';
import { ProductCard } from '../components/ProductCard';
import { FilterItem } from '../components/MenuComponents';
import { FilterToggle } from '../components/FilterToggle';
import { Pagination } from '../components/Pagination';
import './menu.css';

interface HomeProps {
    onlyDonations: boolean;
    setOnlyDonations: React.Dispatch<React.SetStateAction<boolean>>;
    products: Product[];
    loading: boolean;
    error: string | null;
    onProductClick: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onlyDonations, setOnlyDonations, products, loading, error, onProductClick }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = (products || []).filter(p => {
        const matchesDonation = !onlyDonations || p.badge === 'Donación';
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDonation && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans w-full">
            <Header />
            <main className="menu-page">
                <div className="page-header">
                    <div className="page-title">
                        {searchQuery ? (
                            <h2>Resultados de búsqueda</h2>
                        ) : (
                            <h2>Explorar Productos</h2>
                        )}
                        <p>Productos cerca de ti</p>
                    </div>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search size={20} className="search-icon" />
                    </div>
                </div>

                <div className="menu-layout">
                    <aside className="filters-sidebar">
                        <h3 className="filter-section-title">
                            <SlidersHorizontal size={20} />
                            <span>Filtros</span>
                        </h3>

                        <div className="filter-list">
                            <FilterItem title="Categoría" icon={<Leaf />} selected dropdown>
                                <div className="filter-check">
                                    <Check size={14} />
                                </div>
                            </FilterItem>
                            <FilterItem title="Precio" icon={<DollarSign />} dropdown />
                            <FilterItem title="Cercanía" icon={<MapPin />} dropdown />
                            <FilterToggle
                                title="Solo donaciones"
                                icon={<Heart />}
                                checked={onlyDonations}
                                onToggle={(e) => setOnlyDonations(e.target.checked)}
                            />
                        </div>
                    </aside>

                    <section className="products-section">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <p className="text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                                    Error cargando productos: {error}
                                </p>
                            </div>
                        ) : (
                            <>
                                {filteredProducts.length > 0 ? (
                                    <>
                                        <div className="products-grid">
                                            {filteredProducts.map((product) => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    onOpen={() => onProductClick(product)}
                                                />
                                            ))}
                                        </div>
                                        <Pagination />
                                    </>
                                ) : (
                                    <div className="empty-state-container">
                                        <div className="empty-state-icon-wrapper">
                                            <Search size={48} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="empty-state-title">Aún no hay productos</h3>
                                        <p className="empty-state-text">
                                            {searchQuery
                                                ? `No encontramos productos que coincidan con "${searchQuery}".`
                                                : "No hay productos disponibles en este momento. Intenta ajustar tus filtros o vuelve más tarde."}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};
