// app/infrastructure/repositories/ApiMenuRepository.ts
import type { Plato, MenuRepository } from '~/core/domain/plato.model';

export class ApiMenuRepository implements MenuRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl || 'https://proyecto-ukiyo-backend.onrender.com';
  }

  async obtenerCarta(): Promise<Plato[]> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/carta/platos`);
      
      if (!response.ok) throw new Error('Error al obtener la carta desde el servidor');
      
      const data = await response.json();

      if (!Array.isArray(data)) return [];

      return data.map((item: any) => {
        const precioNumerico = Number(item.precio) || 0;
        
        // 🌟 AQUÍ ESTÁ LA MAGIA: Ahora capturamos 'imagen_url' que es lo que manda tu backend
        const urlImagen = item.imagen_url || item.imagen || '';
        const descripcionReal = item.descripcion || '';
        
        const nombreCategoria = item.categoria?.nombre || item.categoria || 'entrantes';
        const categoriaFormateada = typeof nombreCategoria === 'string' ? nombreCategoria.toLowerCase() : 'entrantes';
        
        return {
          id: item.id ? String(item.id) : '',
          nombre: item.nombre || 'Plato sin nombre',
          name: item.nombre || 'Plato sin nombre', 
          
          precio: precioNumerico,
          price: precioNumerico,
          
          descripcion: descripcionReal,
          description: descripcionReal,
          
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