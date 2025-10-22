package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.DetallePedido;
import com.example.foodstoreB.entity.Estado;
import com.example.foodstoreB.entity.Usuario;
import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record PedidoDto(LocalDate fecha, Estado estado, Double total, Usuario usuario, List<DetallePedido> detalles) {
}
