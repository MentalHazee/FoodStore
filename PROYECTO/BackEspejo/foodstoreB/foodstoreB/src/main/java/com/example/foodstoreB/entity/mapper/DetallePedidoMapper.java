package com.example.foodstoreB.entity.mapper;

import com.example.foodstoreB.entity.DetallePedido;
import com.example.foodstoreB.entity.Producto;
import com.example.foodstoreB.entity.dto.DetallePedidoCreate;
import com.example.foodstoreB.entity.dto.DetallePedidoDto;

public class DetallePedidoMapper {
    public static DetallePedidoDto toDto(DetallePedido dp){
        if (dp == null) return null;
        Double subtotal = (dp.getCantidad()) * (dp.getProducto().getPrecio());
        return DetallePedidoDto.builder()
                .id(dp.getId())
                .cantidad(dp.getCantidad())
                .subtotal(subtotal)
                .idProducto(dp.getProducto().getId())
                .nombre(dp.getProducto().getNombre())
                .precio(dp.getProducto().getPrecio())
                .build();
    }

    public static DetallePedido toEntity(DetallePedidoCreate dpc, Producto producto){
        if (dpc == null) return null;
        return DetallePedido.builder()
                .build();
    }
}
