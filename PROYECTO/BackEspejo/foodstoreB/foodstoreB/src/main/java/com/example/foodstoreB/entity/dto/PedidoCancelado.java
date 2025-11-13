package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Estado;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PedidoCancelado {
    private Long id;
    private Estado estado;
    @Builder.Default
    List<Items> items = new ArrayList<>();

}
