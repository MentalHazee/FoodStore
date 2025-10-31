package com.example.foodstoreB.entity.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CategoriaEdit {
    private String nombre;
    private String descripcion;
    private String imagen;
}
