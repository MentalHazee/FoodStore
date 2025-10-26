import { registrarUsuario } from "../../../utils/api"; // Importa la función 'registrarUsuario' desde el módulo de utilidad de API. Se encarga de hacer la llamada HTTP al back para crear el usuario.
import { saveSession } from "../../../utils/auth"; // Importa la función 'saveSession' desde el módulo de utilidad de autenticación. Se usa para guardar la sesión del usuario.
import { navigateTo } from "../../../utils/navigate"; // // Importa la función 'navigateTo' desde el módulo de utilidad de navegación. Se usa para redirigir al usuario a otra página después de una acción exitosa.


document.addEventListener('DOMContentLoaded', () =>{ //Cargamos todo el HTML 
    const form = document.getElementById('registerForm') as HTMLFormElement; // Obtiene la referencia al formulario de registro usando su ID 'registerForm'.

    form?.addEventListener('submit', async (e) =>{ // Agrega un manejador al evento de envío del formulario (submi
        e.preventDefault(); // Previene el comportamiento de recarga de página por defecto.
        // Obtiene los valores de los campos (nombre, apellido, celular, mail, contrasena).
        const nombre = (document.getElementById('name') as HTMLInputElement).value;
        const apellido = (document.getElementById('surname') as HTMLInputElement).value;
        const celular = (document.getElementById('phone') as HTMLInputElement).value;
        const mail = (document.getElementById('email') as HTMLInputElement).value;
        const contrasena = (document.getElementById('password') as HTMLInputElement).value;

        //Validación de la contraseña
        if (contrasena.length < 6){
            alert('La contraseña debe contener al menos 6 caracteres.');
            return;
        }
            
        try{ // Llama a la API para crear el usuario y espera la respuesta.
            const user = await registrarUsuario({ nombre, apellido, celular, mail, contrasena });
            saveSession(user); //para hacer auto-login
            navigateTo('/store/home/home.html') // Redirige a la página principal de la tienda.
        } catch (error) {
            console.error(error); // Muestra el error en la consola.
            alert('Error al registrar usuario'); // Muestra un mensaje de error al usuario.
        }
    });
});