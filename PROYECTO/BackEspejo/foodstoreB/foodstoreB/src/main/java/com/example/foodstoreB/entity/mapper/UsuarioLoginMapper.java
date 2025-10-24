package com.example.foodstoreB.entity.mapper;

import com.example.foodstoreB.entity.dto.UsuarioLogin;
import com.example.foodstoreB.entity.dto.UsuarioLoginDto;

public class UsuarioLoginMapper {
    public static UsuarioLoginDto toDTO(UsuarioLogin ul){
        if (ul == null) return null;

        return UsuarioLoginDto.builder()
                .mail(ul.getMail())
                .contrasena(ul.getContrasena())
                .rol(ul.getRol())
                .build();
    }
}
