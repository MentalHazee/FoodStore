import { getCurrentUser, clearSession } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";


document.addEventListener('DOMContentLoaded', () =>{
    const session = getCurrentUser();
    if (!session){
        console.log("No hay sesion, redirigiendo al login");
        navigateTo('/auth/login/login.html');
    }

    //Mostramos el nombre del admin en el header
    const userNameElement = document.getElementById('userNameHeader');
    if (userNameElement){
        userNameElement.textContent = session.nombre || session.mail || 'Admin';
    }


    //Manejo de cierre de sesion
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn?.addEventListener('click', (e) =>{
        e.preventDefault();
        clearSession(); //Eliminamos la sesion del localStorage
        navigateTo('/auth/login/login.html'); //Redirige al login
    })
})
