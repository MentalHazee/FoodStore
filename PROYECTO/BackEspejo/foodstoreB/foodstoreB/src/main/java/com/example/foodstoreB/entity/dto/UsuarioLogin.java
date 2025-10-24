package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Rol;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UsuarioLogin {
    private String mail;
    private String contrasena;
}
