

export interface Producto {
    nombre: string;
    precioNormal: number | null;  // Permite que el precio normal sea nulo
    precioReducido: number | null; // Permite que el precio reducido sea nulo
    foto: string;
    id: string;
    fecha: Date;
}

export interface Cliente {
    uid: string;   
    email: string;
    nombre: string;
    celular: string;
    foto: string;
    referencia: string;
    ubicacion: any;
}

export interface Pedido {
    id: string;
    cliente: Cliente | null;
    productos: ProductoPedido[]; // Cambiado a ProductoPedido[]
    precioTotal: number | null;
    estado: string;
    fecha: any;
    valoracion: number | null;
}

  

export interface ProductoPedido {
    producto: Producto;
    cantidad: number;
}

export type EstadoPedido = 'enviado' | 'visto' | 'camino' | 'entregado'