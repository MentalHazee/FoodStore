interface IOrder {
  id: number;
  estado: string; // pending, processing, completed, cancelled
  fecha: string; // ISO string o como lo devuelva tu API
  total: number;
  items: IOrderItem[]; // Detalles del pedido
  phone: string; // Datos de entrega
  address: string;
  paymentMethod: string;
  notes?: string;
  // Añade otros campos que necesites
}

interface IOrderItem {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  imagenUrl: string;
}