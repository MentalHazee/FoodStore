import { registrarUsuario } from "../../../utils/api";
import { saveSession } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";


document.addEventListener('DOMContentLoaded', () =>{
    const form = document.getElementById('registerForm') as HTMLFormElement;

    form?.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const nombre = (document.getElementById('name') as HTMLInputElement).value;
        const apellido = (document.getElementById('surname') as HTMLInputElement).value;
        const celular = (document.getElementById('phone') as HTMLInputElement).value;
        const mail = (document.getElementById('email') as HTMLInputElement).value;
        const contrasena = (document.getElementById('password') as HTMLInputElement).value;

        if (contrasena.length < 6){
            alert('La contraseña debe contener al menos 6 caracteres.');
            return;
        }
            
        try{
            const user = await registrarUsuario({ nombre, apellido, celular, mail, contrasena });
            saveSession(user); //para hacer auto-login
            navigateTo('/store/home/home.html')
        } catch (error) {
            console.error(error);
            alert('Error al registrar usuario');
        }
    });
});