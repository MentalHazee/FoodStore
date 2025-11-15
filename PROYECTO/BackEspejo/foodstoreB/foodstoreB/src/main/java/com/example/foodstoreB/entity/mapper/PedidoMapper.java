package com.example.foodstoreB.entity.mapper;

import com.example.foodstoreB.entity.*;
import com.example.foodstoreB.entity.dto.DetallePedidoCreate;
import com.example.foodstoreB.entity.dto.DetallePedidoDto;
import com.example.foodstoreB.entity.dto.PedidoCreate;
import com.example.foodstoreB.entity.dto.PedidoDto;
import com.example.foodstoreB.repository.ProductoRepository;
import com.example.foodstoreB.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


public class PedidoMapper {
    public static PedidoDto toDto(Pedido p){
        if (p == null) return null;
        List<DetallePedidoDto> detallePedidoDtos = p.getDetalles().stream()
                .map(DetallePedidoMapper::toDto)
                .collect(Collectors.toList());
        Double total = p.getDetalles().stream()
                .mapToDouble(DetallePedido::getSubtotal)
                .sum();
        return PedidoDto.builder()
                .id(p.getId())
                .fecha(p.getFecha())
                .nombre(p.getUsuario().getNombre())
                .apellido(p.getUsuario().getApellido())
                .items(detallePedidoDtos)
                .total(total)
                .estado(p.getEstado())
                .address(p.getAddress())
                .phone(p.getPhone())
                .paymentMethod(p.getPaymentMethod())
                .notes(p.getNotes())
                .build();
    }

    public static Pedido toEntity(PedidoCreate pc, Usuario usuario){
        if (pc == null) return null;
        return Pedido.builder()
                .notes(pc.getNotes())
                .phone(pc.getPhone())
                .address(pc.getAddress())
                .paymentMethod(pc.getPaymentMethod())
                .total(pc.getTotal())
                .usuario(usuario)
                .build();
    }
}
