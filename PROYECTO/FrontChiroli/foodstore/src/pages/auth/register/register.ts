import { registrarUsuario } from "../../../utils/api";
import { saveSession } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";


document.addEventListener('DOMContentLoaded', () =>{
    const form = document.getElementById('registerForm') as HTMLFormElement;

    form?.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const surname = (document.getElementById('surname') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        if (password.length < 6){
            alert('La contraseña debe contener al menos 6 caracteres.');
            return;
        }

        try{
            const user = await registrarUsuario({ name, surname, phone, email, password });
            saveSession(user); //para hacer auto-login
            navigateTo('/store/home/home.html')
        } catch (error) {
            console.error(error);
            alert('Error al registrar usuario');
        }
    });
});