package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Rol;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UsuarioAdmin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;
    private String apellido;

    @Column(nullable = false, unique = true)
    private String mail;
    private String contrasena;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Rol rol = Rol.ADMIN;
}
