package com.example.foodstoreB.entity.dto;

import lombok.Builder;

@Builder
public record DetallePedidoDto(Long id, int cantidad, Double subtotal, Long idProducto, String nombre, Double precio) {
}
