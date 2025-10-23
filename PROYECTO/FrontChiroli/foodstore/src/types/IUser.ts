export interface IUsers {
    id: number;
    nombre: string;
    mail: string;
    contrasena: string;
    apellido: string;
    celular: number;
    rol: "admin" | "user";
}