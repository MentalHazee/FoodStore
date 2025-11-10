import { getCurrentUser, clearSession } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";
import {getCategorias, getProductos} from "../../../utils/api";

document.addEventListener('DOMContentLoaded', async () =>{
    const session = getCurrentUser();
    if (!session){
        console.log("No hay sesion, redirigiendo al login");
        navigateTo('/auth/login/login.html');
    }

    //Mostramos el nombre del admin en el header
    const userNameElement = document.getElementById('userNameHeader');
    if (userNameElement){
        userNameElement.textContent = session?.nombre || session?.mail || 'ADMIN';
    }

    //Manejo de cierre de sesion
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn?.addEventListener('click', (e) =>{
        e.preventDefault();
        clearSession(); //Eliminamos la sesion del localStorage
        navigateTo('/auth/login/login.html'); //Redirige al login
    })
    try {
        const categorias = await getCategorias();
        const productos = await getProductos();
 
        // Actualizar el contador de categorías
        const totalCategoriasElement = document.getElementById('totalCategoria');
        if (totalCategoriasElement) {
            totalCategoriasElement.textContent = categorias.length.toString();
        }
 
        // Actualizar el contador de productos
        const totalProductosElement = document.getElementById('totalProducto');
        if (totalProductosElement) {
            totalProductosElement.textContent = productos.length.toString();
        }
        
        // Contar solo productos con stock > 0
        const productosDisponibles = productos.filter(p => p.stock > 0).length;
        const totalDisponiblesElement = document.getElementById('totalDisponible');
        if (totalDisponiblesElement) {
            totalDisponiblesElement.textContent = (productosDisponibles + categorias.length).toString();
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
})
