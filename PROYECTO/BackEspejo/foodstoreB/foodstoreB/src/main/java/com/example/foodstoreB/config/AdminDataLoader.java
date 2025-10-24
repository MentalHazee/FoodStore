package com.example.foodstoreB.config;

// Importamos la interfaz del servicio, no el repositorio directamente
import com.example.foodstoreB.impl.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Clase que se ejecuta una vez al inicio de la aplicación para cargar el usuario administrador.
 * * ATENCIÓN: Este código llamará al metodo crear() sin verificar si el usuario
 * ya existe, lo cual causará una excepción de integridad de datos (UNIQUE constraint)
 * después del primer inicio exitoso.
 */
@Component
public class AdminDataLoader implements CommandLineRunner {

    // CAMBIO: Inyección del AdminService
    private final UsuarioService adminService;

    // Constructor inyecta AdminService
    public AdminDataLoader(UsuarioService adminService) {
        this.adminService = adminService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Ejecutamos directamente el metodo del servicio
        System.out.println(">>> Intentando crear el usuario administrador...");
        try {
            adminService.crear();
            System.out.println(">>> Usuario Administrador creado (o intento de creación) finalizado.");
        } catch (Exception e) {
            // Capturamos la excepción esperada (DataIntegrityViolationException)
            // si el usuario ya existe.
            System.err.println(">>> ERROR al crear el administrador: Es probable que el mail ya exista. " + e.getMessage());
        }
    }
}