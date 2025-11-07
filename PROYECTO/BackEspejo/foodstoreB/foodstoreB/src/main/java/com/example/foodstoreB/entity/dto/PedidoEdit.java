package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Estado;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PedidoEdit {
    private Estado estado;
    private Double total;
}
