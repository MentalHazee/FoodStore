package com.example.foodstoreB.entity.dto;

import lombok.Builder;

@Builder
public record ProductoAdminDto(Long id, String nombre, Double precio, Long idCategoria, String nombreCategoria) {
}
