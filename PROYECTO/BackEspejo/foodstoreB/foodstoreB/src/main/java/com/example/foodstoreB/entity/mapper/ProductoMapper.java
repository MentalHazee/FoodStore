package com.example.foodstoreB.entity.mapper;

import com.example.foodstoreB.entity.Categoria;
import com.example.foodstoreB.entity.Producto;
import com.example.foodstoreB.entity.dto.ProductoAdminDto;
import com.example.foodstoreB.entity.dto.ProductoCreate;
import com.example.foodstoreB.repository.CategoriaRepository;

public class ProductoMapper {

    public static ProductoAdminDto toAdminDto(Producto p){
        if (p == null) return null;

        return ProductoAdminDto.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .precio(p.getPrecio())
                .idCategoria(p.getCategoria().getId())
                .nombreCategoria(p.getCategoria().getNombre())
                .descripcion(p.getDescripcion())
                .imagen(p.getImagen())
                .stock(p.getStock())
                .build();
    }

    public static Producto toEntity(ProductoCreate pc, CategoriaRepository categoriaRepository){
        if (pc == null) return null;
        Categoria categoria = categoriaRepository.findById(pc.getIdCategoria()) // Obtener la categoria desde el CategoriaRepository
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + pc.getIdCategoria()));

        Producto producto = Producto.builder()
                .nombre(pc.getNombre())
                .precio(pc.getPrecio())
                .categoria(categoria)
                .imagen(pc.getImagen())
                .descripcion(pc.getDescripcion())
                .stock(pc.getStock())
                .build();
        categoria.getProductos().add(producto);
        return producto;
    }
}
