import { Product } from '../types/menu.types';

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

      // Intentar extraer la lista de varias formas posibles
      const list: any[] =
        (Array.isArray(json) ? json : null) ||
        json.productos ||
        json.products ||
        json.data ||
        json.items ||
        [];

      return list.map((p) => {
        console.log('Mapping product:', p); // Debug log to see raw product data
        // Construcción correcta de la imagen
        let img =
          p.imagen_url ??
          p.imagen ??
          p.imageUrl ??
          p.image ??
          null;

        // Si la imagen existe
        if (img) {
          // Normalizar slashes (Windows uses backslashes)
          img = img.replace(/\\/g, '/');

          if (!img.startsWith('http')) {
            // Si es ruta relativa, convertirla en absoluta
            const cleanPath = img.replace(/^\/+/, '');
            img = `http://localhost:8081/${cleanPath}`;
          }
        } else {
          // Imagen por defecto si viene null o no existe
          img = `https://placehold.co/300x300/cccccc/333333?text=${encodeURIComponent(
            (p.nombre || p.name || 'Producto').substring(0, 10)
          )}`;
        }

        return {
          id: p.id_producto ?? p.id ?? Math.random(),
          name: p.nombre ?? p.name ?? 'Producto',
          price: p.precio ?? p.price ?? 0,
          originalPrice: p.precio_original ?? null,
          descripcion: p.descripcion ?? p.description ?? '',
          fecha_vencimiento: p.fecha_vencimiento ?? null,
          stock: p.stock ?? p.cantidad ?? null,
          imageUrl: img,
          location: p.nombre_tienda || p.tienda?.nombre || p.store?.name || 'Ubicación Desconocida',
          distance: '0 km',
          badge:
            p.precio === 0
              ? 'Donación'
              : p.descuento
                ? 'Oferta'
                : undefined,
          storeId: p.id_tienda ?? p.store_id ?? p.storeId ?? p.IdTienda ?? p.StoreId ?? p.IDTienda ?? p.tienda?.id ?? p.tienda?.id_tienda ?? p.store?.id ?? 0,
        };
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
