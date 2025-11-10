package com.example.foodstoreB.service;

import com.example.foodstoreB.entity.DetallePedido;
import com.example.foodstoreB.entity.Producto;
import com.example.foodstoreB.entity.dto.Items;
import com.example.foodstoreB.entity.Pedido;
import com.example.foodstoreB.entity.Usuario;
import com.example.foodstoreB.entity.dto.PedidoCreate;
import com.example.foodstoreB.entity.dto.PedidoDto;
import com.example.foodstoreB.entity.dto.PedidoEdit;
import com.example.foodstoreB.entity.mapper.PedidoMapper;
import com.example.foodstoreB.impl.PedidoService;
import com.example.foodstoreB.repository.DetallePedidoRepository;
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
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    DetallePedidoRepository detallePedidoRepository;

    @Override
    public PedidoDto crear(PedidoCreate pc) {
        Usuario usuario = usuarioRepository.findById(pc.getIdUser())
                .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));
        Pedido pedido = PedidoMapper.toEntity(pc, usuario);

        for ( Items items : pc.getItems()){
            Producto producto = productoRepository.findById(items.getIdProducto())
                    .orElseThrow(()-> new RuntimeException("Producto no encontrado"));
            if (producto.getStock() < items.getCantidad()){
                throw new RuntimeException("No hay suficiente stock");
            }else {
                producto.setStock(producto.getStock() - items.getCantidad());
                productoRepository.save(producto);
            }
            Double subtotal = items.getCantidad() * producto.getPrecio();
            DetallePedido detallePedido = DetallePedido.builder()
                    .cantidad(items.getCantidad())
                    .subtotal(subtotal)
                    .producto(producto)
                    .pedido(pedido)
                    .build();
            detallePedidoRepository.save(detallePedido);
            pedido.getDetalles().add(detallePedido);
        }
        return PedidoMapper.toDto(pedidoRepository.save(pedido));
    }

    @Override
    public PedidoDto actualizar(Long id, PedidoEdit pe) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID"));
        pedido.setEstado(pe.getEstado());
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
