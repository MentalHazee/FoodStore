import { loginUsuario } from "../../../utils/api";
import { saveSession } from "../../../utils/auth"; 
import { navigateTo } from "../../../utils/navigate";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm') as HTMLFormElement;

    form?.addEventListener('submit',  async (e) =>{
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const user = await loginUsuario(email, password);
            saveSession(user); //lo guarda en localstorage
            navigateTo(user.rol === 'admin' ? '/admin/adminHome/adminHome.html' : '/store/home/home.html');
        }catch (error){
            alert((error as Error).message)
        }
    });
});