import type { IUsers } from "../types/IUser";

const API_URL = 'http://localhost:8080'; // agregar direccion del localhost

export async function registrarUsuario(userData: Omit<IUsers, 'id' | 'rol'>): Promise<IUsers>{
    const response = await fetch(`${API_URL}/api/crear`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, rol: 'cliente' })  // solo los clientes se pueden registrar
    });

    if (!response.ok){
        const error = await response.text();
        throw new Error(error || 'Error al registrar usuario');
    }

    return response.json();
}

export async function loginUsuario(email: string, password: string): Promise<IUsers>{
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok){
        const error = await response.text();
        throw new Error(error || 'Error al iniciar sesión');
    }

    return response.json();
}