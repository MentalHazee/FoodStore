package com.example.foodstoreB.entity.mapper;

import com.example.foodstoreB.entity.DetallePedido;
import com.example.foodstoreB.entity.Pedido;
import com.example.foodstoreB.entity.Producto;
import com.example.foodstoreB.entity.dto.DetallePedidoCreate;
import com.example.foodstoreB.entity.dto.DetallePedidoDto;
import com.example.foodstoreB.repository.PedidoRepository;
import com.example.foodstoreB.repository.ProductoRepository;

public class DetallePedidoMapper {
    public static DetallePedidoDto toDto(DetallePedido dp){
        if (dp == null) return null;
        //Double subtotal = (dp.getCantidad()) * (dp.getProducto().getPrecio());
        return DetallePedidoDto.builder()
                .id(dp.getId())
                .cantidad(dp.getCantidad())
                .subtotal(dp.getSubtotal())
                .idProducto(dp.getProducto().getId())
                .nombre(dp.getProducto().getNombre())
                .precio(dp.getProducto().getPrecio())
                .build();
    }

    public static DetallePedido toEntity(DetallePedidoCreate dpc, PedidoRepository pedidoRepository, ProductoRepository productoRepository){
        if (dpc == null) return null;
        Pedido pedido = pedidoRepository.findById(dpc.getIdPedido())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrada con ID: " + dpc.getIdPedido()));
        Producto producto = productoRepository.findById(dpc.getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrada con ID: " + dpc.getIdProducto()));

        return DetallePedido.builder()
                .pedido(pedido)
                .producto(producto)
                .cantidad(dpc.getCantidad())
                .subtotal(dpc.getSubtotal())
                .build();
    }
}
