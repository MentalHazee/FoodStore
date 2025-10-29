package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Categoria;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProductoCreate {
    private String nombre;
    private Double precio;
    private Long idCategoria;
}