/**
 * api.ts
 * Cliente HTTP para operaciones de usuario:
 * - registrarUsuario: crea un nuevo usuario (cliente)
 * - loginUsuario: inicia sesión y devuelve los datos del usuario
 *
 * Nota: API_URL apunta a localhost en desarrollo. Para producción conviene
 * leer esa URL desde variables de entorno (ej. import.meta.env.VITE_API_URL).
 */

import type { IUsers } from "../types/IUser";
import type { ICategoria } from "../types/ICategoria";
import type { IProduct } from "../types/IProduct";
//import type { ICartItem } from "../types/ICart";
import type { ICreateOrder } from "../types/IOrders";
import type {IOrder} from "../types/IOrders"

const API_URL = 'http://localhost:8080'; // dirección base del backend (localhost en desarrollo)

/**
 * Registra un nuevo usuario en el servidor.
 * - Se omite 'id' y 'rol' en userData, porque el servidor gestiona el id y
 *   aquí forzamos el rol a 'cliente' (solo clientes pueden registrarse).
 *
 * @param userData - Datos del usuario sin 'id' ni 'rol' (nombre, email, password, etc.)
 * @returns Promise<IUsers> - Usuario creado tal como lo devuelve la API (incluye id y rol)
 * @throws Error - Si la respuesta HTTP no es OK, lanza un Error con el mensaje devuelto por la API.
 */
export async function registrarUsuario(userData: Omit<IUsers, 'id' | 'rol'>): Promise<IUsers>{
    // Construimos la petición POST con el body en JSON. Añadimos rol: 'cliente'.
    const response = await fetch(`${API_URL}/usuario/crear`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData})  // solo los clientes se pueden registrar
    });

    // Si la respuesta no es 2xx, intentamos leer el texto de error y lanzar una excepción.
    if (!response.ok){
        const error = await response.text();
        // Si la API no devuelve texto, usamos un mensaje por defecto.
        throw new Error(error || 'Error al registrar usuario');
    }

    // Convertimos la respuesta a JSON y la devolvemos (se espera que cumpla IUsers).
    return response.json();
}

/**
 * Solicita al servidor el inicio de sesión para un usuario con mail y contrasena.
 *
 * @param mail - Correo electrónico del usuario
 * @param contrasena - Contraseña del usuario
 * @returns Promise<IUsers> - Datos del usuario autenticado (puede incluir token, rol, id, etc.)
 * @throws Error - Si la respuesta HTTP no es OK, lanza un Error con el mensaje devuelto por la API.
 */
export async function loginUsuario(mail: string, contrasena: string): Promise<IUsers>{
    // Petición POST a /auth/login con credenciales en el body.
    const response = await fetch(`${API_URL}/usuario/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail, contrasena})
    });

    // Manejo de errores: leer el texto devuelto por la API y lanzar Error.
    if (!response.ok){
        const error = await response.text();
        throw new Error(error || 'Error al iniciar sesión');
    }

    // Devolver el JSON con los datos del usuario autenticado.
    return response.json();
}

export async function getCategorias(): Promise<ICategoria[]> {
    const response = await fetch(`${API_URL}/categoria/buscarTodos`);
    if (!response.ok) {
        throw new Error('No se pudieron cargar las categorias');
    }
    return response.json();//devuelve un array de icategoria
}


//obtiene los productos. Filtra por categoria opcionalmente
export async function getProductos(categoriaId?: number): Promise<IProduct[]> {
    const url = categoriaId ? `${API_URL}/producto/?categoriaId=${categoriaId}` : `${API_URL}/producto/buscarTodos`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('No se pudieron cargar los productos');
    }
    return response.json();//devuelve un array de IProduct
}


export async function createOrder(orderData: ICreateOrder): Promise<Response>{
    const response = await fetch (`${API_URL}/pedido/crear`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    });
    return response;
}

export async function getOrderById(idUser: number): Promise<IOrder[]>{
    const response = await fetch (`${API_URL}/pedido/buscarTodos/${idUser}`);

    if(!response.ok){
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status} al cargar los pedidos`);
    }
    return response.json();
}

export async function getAllOrders(): Promise<IOrder[]>{
    const response = await fetch (`${API_URL}/pedido/busquedaAdmin`);

    if(!response.ok){
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status} al cargar los pedidos`);
    }
    return response.json();
}

export async function updateStatus(idOrder: number, newStatus?: string ): Promise<Response>{
    const response = await fetch (`${API_URL}/pedido/edit/${idOrder}`,{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({estado: newStatus})
    });
    if(!response.ok){
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status} al actualizar el estado`);
    }
    return response;
}

export async function cancelarPedido(idOrder: number): Promise<Response>{
    const response = await fetch (`${API_URL}/pedido/cancelar/${idOrder}`,{
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json'
        }
    });
    return response;
}