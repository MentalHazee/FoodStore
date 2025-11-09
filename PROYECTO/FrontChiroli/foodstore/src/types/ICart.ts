export interface ICartItem{
    idProducto: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagenUrl: string;
}

export interface ICart{
    items: ICartItem[];
}