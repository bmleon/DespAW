// app/infrastructure/repositories/ApiMenuRepository.ts
import type { Plato, MenuRepository } from '~/core/domain/plato.model';

export class ApiMenuRepository implements MenuRepository {
  private getBaseUrl() {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl || 'https://ukiyocazorla.es/api';
  }

  async obtenerCarta(): Promise<Plato[]> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/productos`);
      
      if (!response.ok) throw new Error('Error al obtener la carta desde el servidor');
      
      const data = await response.json();

      if (!Array.isArray(data)) return [];

      // Dominio oficial de la tienda donde SÍ existe la carpeta public/comida
      const dominioTienda = 'https://web-ukiyo.vercel.app';

      return data.map((item: any) => {
        const precioNumerico = Number(item.precio) || 0;
        
        // 🌟 Si la descripción empieza por /comida, le añadimos el dominio de la tienda delante
        const rutaDescripcion = item.descripcion || '';
        const urlImagenCorregida = rutaDescripcion.startsWith('/') 
          ? `${dominioTienda}${rutaDescripcion}`
          : rutaDescripcion;
        
        return {
          id: item.id ? String(item.id) : '',
          nombre: item.nombre || 'Plato sin nombre',
          name: item.nombre || 'Plato sin nombre',
          
          precio: precioNumerico,
          price: precioNumerico,
          
          // Le pasamos la URL completa apuntando a la tienda para que no falle
          descripcion: urlImagenCorregida,
          description: urlImagenCorregida,
          
          categoria: item.categoria || 'entrantes',
          category: item.categoria || 'entrantes',
          
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