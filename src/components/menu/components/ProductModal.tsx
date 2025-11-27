import React from 'react';
import { X, MapPin } from 'lucide-react';
import { Product } from '../../../types/menu.types';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
    if (!product) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button
                    onClick={onClose}
                    className="modal-close"
                >
                    <X size={20} />
                </button>

                <div className="modal-body">
                    <div className="modal-image-section">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="modal-image"
                        />
                    </div>

                    <div className="modal-info-section">
                        <div className="modal-header">
                            <div>
                                <h3 className="modal-title">{product.name}</h3>
                                <p className="modal-location">
                                    <MapPin size={16} />
                                    {product.location}
                                </p>
                            </div>
                            <div className="modal-price-block">
                                <p className="modal-price">${product.price}</p>
                                {product.originalPrice && (
                                    <p className="modal-original-price">${product.originalPrice}</p>
                                )}
                            </div>
                        </div>

                        <p className="modal-description">
                            {product.descripcion || 'Sin descripción disponible.'}
                        </p>

                        <div className="modal-meta-grid">
                            <div className="modal-meta-item">
                                <span className="modal-meta-label">Stock disponible</span>
                                <span className="modal-meta-value">
                                    {typeof product.stock !== 'undefined' && product.stock !== null ? product.stock : '—'} unidades
                                </span>
                            </div>
                            <div className="modal-meta-item">
                                <span className="modal-meta-label">Fecha de vencimiento</span>
                                <span className="modal-meta-value">
                                    {product.fecha_vencimiento ? new Date(product.fecha_vencimiento).toLocaleDateString() : '—'}
                                </span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                onClick={onClose}
                                className="btn-modal-cancel"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => { onAddToCart(product, 1); onClose(); }}
                                className="btn-modal-add"
                            >
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
