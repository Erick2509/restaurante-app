export interface Plato {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenUrl?: string;
    // Agregado para el carrito
  cantidad?: number;
  }
  