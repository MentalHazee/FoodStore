package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Producto;
import lombok.Builder;

import java.util.List;
@Builder
public record CategoriaAdminDto(Long id, String nombre, List<ProductoAdminDto> productos, String descripcion, String imagen) {
}
