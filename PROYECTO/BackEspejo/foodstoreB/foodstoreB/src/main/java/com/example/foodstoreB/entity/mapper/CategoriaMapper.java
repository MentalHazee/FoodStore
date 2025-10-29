package com.example.foodstoreB.entity.mapper;

import com.example.foodstoreB.entity.Categoria;
import com.example.foodstoreB.entity.dto.CategoriaCreate;
import com.example.foodstoreB.entity.dto.CategoriaAdminDto;
import com.example.foodstoreB.entity.dto.ProductoAdminDto;

import java.util.List;
import java.util.stream.Collectors;

public class CategoriaMapper {
    public static CategoriaAdminDto toAdminDto(Categoria c){
        if (c == null) return null;
        List<ProductoAdminDto> productosDto = c.getProductos().stream()
                .filter(p -> !p.isEliminado())
                .map(ProductoMapper::toAdminDto)
                .collect(Collectors.toList());
        return CategoriaAdminDto.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .productos(productosDto)
                .build();
    }

    public static Categoria toEntity(CategoriaCreate cc){
        if (cc == null) return null;
        return Categoria.builder()
                .nombre(cc.getNombre())
                .build();
    }

}
