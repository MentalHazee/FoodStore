export interface IProduct{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imageURL: string;
    //disponible: "true";
    categoriaId: number;
}