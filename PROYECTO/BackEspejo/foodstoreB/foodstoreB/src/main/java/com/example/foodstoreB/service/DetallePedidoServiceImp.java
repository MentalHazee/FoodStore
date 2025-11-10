package com.example.foodstoreB.service;

import com.example.foodstoreB.entity.DetallePedido;
import com.example.foodstoreB.entity.Producto;
import com.example.foodstoreB.entity.dto.DetallePedidoCreate;
import com.example.foodstoreB.entity.dto.DetallePedidoDto;
import com.example.foodstoreB.entity.dto.DetallePedidoEdit;
import com.example.foodstoreB.entity.mapper.DetallePedidoMapper;
import com.example.foodstoreB.impl.DetallePedidoService;
import com.example.foodstoreB.repository.DetallePedidoRepository;
import com.example.foodstoreB.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class DetallePedidoServiceImp implements DetallePedidoService {
    @Autowired
    DetallePedidoRepository detallePedidoRepository;
    @Autowired
    ProductoRepository productoRepository;


    @Override
    public DetallePedidoDto crear(DetallePedidoCreate dpc) {
        return null;
    }

    @Override
    public DetallePedidoDto actualizar(Long id, DetallePedidoEdit dpe) {
        DetallePedido dp = detallePedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle pedido no encontrado con ID"));
        if (dpe.getCantidad() <= dp.getProducto().getStock()){
            dp.setCantidad(dpe.getCantidad());
        }else {
            throw new RuntimeException("No hay suficiente stock");
        }
        return DetallePedidoMapper.toDto(detallePedidoRepository.save(dp));
    }

    @Override
    public DetallePedidoDto buscaId(Long id) {
        DetallePedido dp = detallePedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle pedido no encontrado con ID"));
        return DetallePedidoMapper.toDto(dp);
    }

    @Override
    public List<DetallePedidoDto> buscarTodos() {
        List<DetallePedido> detalles = detallePedidoRepository.findAllByEliminadoFalse();
        return detalles.stream()
                .map(DetallePedidoMapper::toDto)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        DetallePedido dp = detallePedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle pedido no encontrado con ID"));
        dp.setEliminado(true);
    }
}
