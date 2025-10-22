package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Pedido;
import lombok.Builder;

import java.util.List;
@Builder
public record UsuarioDto(String nombre, String apellido, String mail, int celular, List<Pedido> pedidos) {
}
