export interface IUsers {
    id: number;
    name: string;
    email: string;
    password: string;
    surname: string;
    phone: string;
    rol: "admin" | "user";
}