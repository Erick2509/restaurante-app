// pedido.ts
export interface PedidoPlato {
    platoId: number;
    cantidad: number;
  }
  
  export type TipoEntrega = 'local' | 'llevar';
  
  export interface Pedido {
    clienteId: string;
    mesaId: number | null;
    mozoId: number | null;
    estado: string;
    metodoPago: string;
    total: number;
    tipoEntrega: TipoEntrega; // aquí se restringe el valor posible
    platos: {
      platoId: number;
      cantidad: number;
    }[];
  }
  
  