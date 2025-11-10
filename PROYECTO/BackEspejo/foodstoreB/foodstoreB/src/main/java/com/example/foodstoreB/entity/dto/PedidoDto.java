package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.DetallePedido;
import com.example.foodstoreB.entity.Estado;
import com.example.foodstoreB.entity.Usuario;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record PedidoDto(Long id, LocalDateTime fecha, Estado estado, Double total, String nombre, String apellido, List<DetallePedidoDto> items) {
}
