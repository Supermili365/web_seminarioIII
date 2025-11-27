import type { Product, ApiProduct } from '../types/menu.types';
// Asegúrate de tener también MOCK_PRODUCTS si aún lo usas como fallback
// import { MOCK_PRODUCTS } from '../mocks/products';
const API_URL = 'http://localhost:8081/api/v1';

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_URL}/products/`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const contentType = res.headers.get('content-type') || '';
      let json: any;

      if (contentType.includes('application/json')) {
        json = await res.json();
        console.log('API Response (GetAllProducts):', json);
      } else {
        console.warn('Received non-JSON response, using mock data');
        return MOCK_PRODUCTS;
      }

      const list: ApiProduct[] = Array.isArray(json)
        ? json
        : json.productos ?? [];

      return list.map((p: ApiProduct) => {
        console.log('Mapping product:', p);

        // -------- IMAGEN --------
        let img = p.imagen_url || null;

        if (img) {
          img = img.replace(/\\/g, '/');
          if (!img.startsWith('http')) {
            img = `http://localhost:8081/${img.replace(/^\/+/, '')}`;
          }
        } else {
          img = `https://placehold.co/300x300/cccccc/333333?text=${encodeURIComponent(
            p.nombre.substring(0, 10)
          )}`;
        }

        // -------- PRECIOS (regla nueva) --------
        const rawOriginal = (p as any).precio_original;
        const rawDiscount = (p as any).precio_descuento;
        const rawPrecio = (p as any).precio;

        let discountPrice: number;
        let originalPrice: number;

        if (
          rawOriginal !== undefined &&
          rawOriginal !== null &&
          rawDiscount !== undefined &&
          rawDiscount !== null
        ) {
          // Caso: backend ya trae ambos → respetar
          originalPrice = Number(rawOriginal);
          discountPrice = Number(rawDiscount);
        } else {
          // Caso general: el cliente solo escribe un price
          // Ese price es el precio actual (con descuento)
          const base =
            rawDiscount ?? rawPrecio ?? rawOriginal ?? 0;

          discountPrice = Number(base);
          if (!Number.isFinite(discountPrice)) discountPrice = 0;

          // originalPrice = price + 35%
          originalPrice = Math.round(discountPrice * 1.35);
        }

        // Seguridad anti-NaN
        if (!Number.isFinite(originalPrice)) originalPrice = discountPrice;

        // -------- BADGE --------
        const badgeFromBackend = (p as any).badge;
        const badge =
          badgeFromBackend ??
          (discountPrice === 0
            ? 'Donación'
            : originalPrice > discountPrice
            ? 'Oferta'
            : undefined);

        // -------- MAPEADO FINAL --------
        const mapped: Product = {
          id: p.id_producto,
          name: p.nombre.trim(),
          price: discountPrice,
          originalPrice,
          descripcion: p.descripcion,
          fecha_vencimiento: p.fecha_vencimiento,
          stock: p.stock,
          imageUrl: img,
          location: (p as any).nombre_tienda ?? 'Ubicación Desconocida',
          distance: '0 km',
          badge,
          categoryName: (p as any).nombre_categoria,
          storeName: (p as any).nombre_tienda,
          storeId: (p as any).id_tienda,
        };

        return mapped;
      });
    } catch (error) {
      console.error('Error fetching products, using mock data:', error);
      return MOCK_PRODUCTS;
    }
  },
};





const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Manzanas Orgánicas',
    price: 0,
    badge: 'Donación',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80',
    location: 'Frutería Central',
    distance: '0.5 km',
    descripcion: 'Manzanas frescas recolectadas esta mañana. Ideales para consumo inmediato.',
    stock: 10,
    fecha_vencimiento: '2023-12-31'
  },
  {
    id: 2,
    name: 'Pan Artesanal',
    price: 1500,
    originalPrice: 3000,
    badge: 'Oferta',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
    location: 'Panadería El Trigo',
    distance: '1.2 km',
    descripcion: 'Pan de masa madre con semillas. 50% de descuento por ser del día anterior.',
    stock: 5,
    fecha_vencimiento: '2023-12-25'
  },
  {
    id: 3,
    name: 'Leche Entera',
    price: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80',
    location: 'Supermercado Norte',
    distance: '2.0 km',
    descripcion: 'Leche entera pasteurizada. Próxima a vencer.',
    stock: 20,
    fecha_vencimiento: '2023-12-28'
  },
  {
    id: 4,
    name: 'Zanahorias',
    price: 0,
    badge: 'Donación',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80',
    location: 'Verdulería La Huerta',
    distance: '0.8 km',
    descripcion: 'Zanahorias un poco deformes pero perfectas para cocinar.',
    stock: 15,
    fecha_vencimiento: '2023-12-30'
  },
  {
    id: 5,
    name: 'Yogurt Natural',
    price: 1000,
    originalPrice: 1800,
    badge: 'Oferta',
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=300&q=80',
    location: 'Lácteos del Sur',
    distance: '3.5 km',
    descripcion: 'Yogurt natural sin azúcar.',
    stock: 8,
    fecha_vencimiento: '2023-12-26'
  }
];
