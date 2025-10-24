package com.example.foodstoreB.entity.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UsuarioCreate {
    private String nombre;
    private String apellido;
    private String mail;
    private String celular;
    private String contrasena;
}
