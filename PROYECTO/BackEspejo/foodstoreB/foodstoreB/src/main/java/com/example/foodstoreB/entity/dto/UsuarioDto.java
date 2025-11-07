package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Pedido;
import com.example.foodstoreB.entity.Rol;
import lombok.Builder;

import java.util.List;
@Builder
public record UsuarioDto(Long id, String nombre, String apellido, String mail, String celular, List<PedidoDto> pedidos, Rol rol) {
}
