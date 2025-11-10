package com.example.foodstoreB.entity.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Items {
    private Long idProducto;
    private int cantidad;
}
