// app/core/domain/plato.model.ts

export interface Plato {
  id: string | number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  disponible: boolean;
  alergenos?: string[]; 
}

export interface MenuRepository {
  obtenerCarta(): Promise<Plato[]>;
}