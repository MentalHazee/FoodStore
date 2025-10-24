package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Rol;
import lombok.Builder;

@Builder
public record UsuarioLoginDto(String mail, String contrasena, Rol rol) {
}
