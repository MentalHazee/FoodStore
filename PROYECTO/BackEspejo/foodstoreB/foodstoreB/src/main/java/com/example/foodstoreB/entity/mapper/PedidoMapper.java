package com.example.foodstoreB.entity.mapper;

import com.example.foodstoreB.entity.Pedido;
import com.example.foodstoreB.entity.dto.PedidoCreate;
import com.example.foodstoreB.entity.dto.PedidoDto;

public class PedidoMapper {
    public static PedidoDto toDTO(Pedido p){
        if (p == null) return null;

        return PedidoDto.builder()
                .fecha(p.getFecha())
                .usuario(p.getUsuario())
                .detalles(p.getDetalles())
                .total(p.getTotal())
                .estado(p.getEstado())
                .build();
    }

    public static Pedido toEntity(PedidoCreate pc){
        if (pc == null) return null;
        return Pedido.builder()
                .build();
    }
}
