import type { IUsers } from "../types/IUser";

export function saveSession(user: IUsers): void{
    localStorage.setItem('user', JSON.stringify(user));
}

export function getCurrentUser(): IUsers | null{
    const userString = localStorage.getItem('user');
    return userString? JSON.parse(userString): null;
}

export function clearSession(): void{
    localStorage.removeItem('user');
}