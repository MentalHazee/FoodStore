package com.example.foodstoreB.entity.dto;

import com.example.foodstoreB.entity.Producto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class DetallePedidoCreate {
    private Long idPedido;
    private int cantidad;
    private Long idProducto;
    private Double subtotal;
}
