package com.example.foodstoreB.entity.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PedidoCreate {
    private Long idUser;
    private String phone;
    private String address;
    private String paymentMethod;
    private String notes;
    private Double total;
    @Builder.Default
    private List<Items> items = new ArrayList<>();
}
