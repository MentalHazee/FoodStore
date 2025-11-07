package com.example.foodstoreB.entity.mapper;

import com.example.foodstoreB.entity.Usuario;
import com.example.foodstoreB.entity.dto.PedidoDto;
import com.example.foodstoreB.entity.dto.UsuarioCreate;
import com.example.foodstoreB.entity.dto.UsuarioDto;

import java.util.List;
import java.util.stream.Collectors;

public class UsuarioMapper {
    public static UsuarioDto toDTO(Usuario u){
        if (u == null || u.isEliminado()) return null;
        List<PedidoDto> pedidosDto = u.getPedidos().stream()
                .map(PedidoMapper::toDto)
                .collect(Collectors.toList());

        return UsuarioDto.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .apellido(u.getApellido())
                .mail(u.getMail())
                .celular(u.getCelular())
                .pedidos(pedidosDto)
                .rol(u.getRol())
                .build();
    }

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
