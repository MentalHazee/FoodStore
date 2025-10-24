import type { IUsers } from "../types/IUser";

export function saveSession(user: IUsers): void{
    const sessionData = {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    mail: user.mail,
    rol: user.rol
  };
    localStorage.setItem('user', JSON.stringify(sessionData));
}

export function getCurrentUser(): IUsers | null{
    const userString = localStorage.getItem('user');
    return userString? JSON.parse(userString): null;
}

export function clearSession(): void{
    localStorage.removeItem('user');
}