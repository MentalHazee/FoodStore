package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Estado;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record PedidoDto(Long id, LocalDateTime fecha, Estado estado, Double total, String nombre, String apellido,
                        String phone, String address, String paymentMethod, String notes, List<DetallePedidoDto> items) {
}
