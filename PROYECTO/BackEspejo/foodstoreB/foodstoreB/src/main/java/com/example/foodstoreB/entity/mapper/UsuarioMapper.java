package com.example.foodstoreB.entity.mapper;

import com.example.foodstoreB.entity.Usuario;
import com.example.foodstoreB.entity.dto.UsuarioCreate;
import com.example.foodstoreB.entity.dto.UsuarioDto;

public class UsuarioMapper {
    public static UsuarioDto toDTO(Usuario u){
        if (u == null || u.isEliminado()) return null;

        return UsuarioDto.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .apellido(u.getApellido())
                .mail(u.getMail())
                .celular(u.getCelular())
                .pedidos(u.getPedidos())
                .rol(u.getRol())
                .build();
    }

    // Se actualiza para que NO mapee el profesor, ya que el servicio lo buscará.
    public static Usuario toEntity(UsuarioCreate uc){
        if (uc == null) return null;
        return Usuario.builder()
                .nombre(uc.getNombre())
                .apellido(uc.getApellido())
                .mail(uc.getMail())
                .celular(uc.getCelular())
                .contrasena(uc.getContrasena())
                .build();
    }
}
