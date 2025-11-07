package com.example.foodstoreB.entity.mapper;

import com.example.foodstoreB.entity.DetallePedido;
import com.example.foodstoreB.entity.Pedido;
import com.example.foodstoreB.entity.Producto;
import com.example.foodstoreB.entity.Usuario;
import com.example.foodstoreB.entity.dto.DetallePedidoCreate;
import com.example.foodstoreB.entity.dto.DetallePedidoDto;
import com.example.foodstoreB.entity.dto.PedidoCreate;
import com.example.foodstoreB.entity.dto.PedidoDto;
import com.example.foodstoreB.repository.ProductoRepository;
import com.example.foodstoreB.repository.UsuarioRepository;

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
                .detalles(detallePedidoDtos)
                .total(total)
                .estado(p.getEstado())
                .build();
    }

    public static Pedido toEntity(PedidoCreate pc, UsuarioRepository usuarioRepository){
        if (pc == null) return null;
        Usuario usuario = usuarioRepository.findById(pc.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrada con ID: " + pc.getIdUsuario()));
        return Pedido.builder()
                .usuario(usuario)
                .total(pc.getTotal())
                .build();
    }
}
