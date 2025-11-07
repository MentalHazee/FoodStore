package com.example.foodstoreB.service;

import com.example.foodstoreB.entity.Pedido;
import com.example.foodstoreB.entity.dto.PedidoCreate;
import com.example.foodstoreB.entity.dto.PedidoDto;
import com.example.foodstoreB.entity.dto.PedidoEdit;
import com.example.foodstoreB.entity.mapper.PedidoMapper;
import com.example.foodstoreB.impl.PedidoService;
import com.example.foodstoreB.repository.PedidoRepository;
import com.example.foodstoreB.repository.ProductoRepository;
import com.example.foodstoreB.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class PedidoServiceImp implements PedidoService {
    @Autowired
    PedidoRepository pedidoRepository;
    @Autowired
    UsuarioRepository usuarioRepository;

    @Override
    public PedidoDto crear(PedidoCreate pc) {
        Pedido pedido = PedidoMapper.toEntity(pc, usuarioRepository);
        return PedidoMapper.toDto(pedidoRepository.save(pedido));
    }

    @Override
    public PedidoDto actualizar(Long id, PedidoEdit pe) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID"));
        pedido.setEstado(pe.getEstado());
        pedido.setTotal(pe.getTotal());
        return PedidoMapper.toDto(pedidoRepository.save(pedido));
    }

    @Override
    public PedidoDto buscaId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID"));
        return PedidoMapper.toDto(pedido);
    }

    @Override
    public List<PedidoDto> buscarTodos() {
        List<Pedido> pedidos = pedidoRepository.findAllByEliminadoFalse();
        return pedidos.stream()
                .map(PedidoMapper::toDto)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID"));
        pedido.setEliminado(true);
    }
}
