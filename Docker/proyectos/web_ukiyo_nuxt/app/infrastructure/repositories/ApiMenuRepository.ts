// app/infrastructure/repositories/ApiMenuRepository.ts
import type { Plato, MenuRepository } from '~/core/domain/plato.model';

export class ApiMenuRepository implements MenuRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl || 'https://proyecto-ukiyo-backend.onrender.com';
  }

  async obtenerCarta(): Promise<Plato[]> {
    try {
      // 1. Cambiamos a la ruta oficial de tu nuevo backend
      const response = await fetch(`${this.getBaseUrl()}/carta/platos`);
      
      if (!response.ok) throw new Error('Error al obtener la carta desde el servidor');
      
      const data = await response.json();

      if (!Array.isArray(data)) return [];

      return data.map((item: any) => {
        const precioNumerico = Number(item.precio) || 0;
        
        // 2. La imagen ahora viene directa de Supabase, ya no usamos la descripción
        const urlImagen = item.imagen || '';
        const descripcionReal = item.descripcion || '';
        
        // El backend puede devolver la categoría como objeto o el nombre directo
        const nombreCategoria = item.categoria?.nombre || item.categoria || 'entrantes';
        const categoriaFormateada = typeof nombreCategoria === 'string' ? nombreCategoria.toLowerCase() : 'entrantes';
        
        return {
          id: item.id ? String(item.id) : '',
          nombre: item.nombre || 'Plato sin nombre',
          name: item.nombre || 'Plato sin nombre', // Para compatibilidad
          
          precio: precioNumerico,
          price: precioNumerico,
          
          // La descripción vuelve a ser texto real
          descripcion: descripcionReal,
          description: descripcionReal,
          
          // Guardamos la URL pública de Supabase en los campos de imagen
          imagen: urlImagen,
          image: urlImagen,
          
          categoria: categoriaFormateada,
          category: categoriaFormateada,
          
          disponible: item.disponible !== false,
          available: item.disponible !== false
        };
      }) as unknown as Plato[];

    } catch (error) {
      console.error('❌ Error [ApiMenuRepository]:', error);
      return [];
    }
  }
}