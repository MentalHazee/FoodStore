
export interface ICreateOrder{
    idUser: number;
    phone: string;
    address: string;
    paymentMethod: 'cash' | 'card' | 'transfer',
    notes?: string;
    items: Array<{idProducto: number; cantidad: number}>;
    total: number;
}

/*export interface items{
    items: Array<{idProducto: number; cantidad: number}>;
}*/ 

export interface IOrderItem{
    id: number,
    idProducto: number,
    nombre: string,
    precio: number,
    cantidad: number;
    subtotal: number;
    imagenUrl: string;
}

export interface IOrder{
    id: number;
    idUsuario: number; // El ID del usuario que creó el pedido
    estado: 'pending' | 'processing' | 'completed' | 'cancelled'; // Estados del TP
    fecha: string; // Fecha en formato ISO string
    phone: string;
    address: string;
    paymentMethod: 'cash' | 'card' | 'transfer';
    notes?: string; // Opcional
    total: number;
    items: IOrderItem[];
}