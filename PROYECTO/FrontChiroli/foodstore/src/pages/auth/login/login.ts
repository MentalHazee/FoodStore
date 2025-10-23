/**
 * Controlador del formulario de inicio de sesión.
 * - Importa funciones para autenticación, manejo de sesión y navegación.
 * - Escucha el envío del formulario, evita el comportamiento por defecto,
 *   obtiene credenciales, intenta autenticar al usuario y redirige según su rol.
 */

import { loginUsuario } from "../../../utils/api";
import { saveSession } from "../../../utils/auth"; 
import { navigateTo } from "../../../utils/navigate";

document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos el formulario por su ID. Usamos una aserción de tipo para
    // indicarle a TypeScript que es un HTMLFormElement (puede ser null).
    const form = document.getElementById('loginForm') as HTMLFormElement;

    // Si el formulario existe, añadimos el listener para el evento 'submit'.
    form?.addEventListener('submit',  async (e) =>{
        // Evitamos que el formulario recargue la página (comportamiento por defecto).
        e.preventDefault();

        // Recuperamos los valores de los campos email y password.
        // Usamos aserciones de tipo para indicar que son HTMLInputElement.
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            // Llamamos a la función de la API para autenticar al usuario.
            // Se asume que loginUsuario devuelve un objeto usuario con al menos la propiedad 'rol'.
            const user = await loginUsuario(email, password);

            // Guardamos la sesión (por ejemplo en localStorage) usando la utilidad correspondiente.
            saveSession(user); // lo guarda en localstorage

            // Redirigimos al usuario según su rol:
            // - Si es 'admin' -> página de administración
            // - Si no -> página de tienda/usuario
            navigateTo(user.rol === 'admin' ? '/admin/adminHome/adminHome.html' : '/store/home/home.html');
        } catch (error) {
            // En caso de error (credenciales inválidas, fallo de red, etc.) mostramos una alerta
            // con el mensaje de error. Convertimos 'error' a Error para acceder a message.
            alert((error as Error).message)
        }
    });
});