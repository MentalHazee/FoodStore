package com.example.foodstoreB.entity.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UsuarioEdit {
    private String mail;
    private String celular;
    private String contrasena;
}
