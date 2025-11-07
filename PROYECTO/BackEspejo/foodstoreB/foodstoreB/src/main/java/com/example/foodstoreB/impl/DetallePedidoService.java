package com.example.foodstoreB.impl;

import com.example.foodstoreB.entity.dto.DetallePedidoCreate;
import com.example.foodstoreB.entity.dto.DetallePedidoDto;
import com.example.foodstoreB.entity.dto.DetallePedidoEdit;

import java.util.List;

public interface DetallePedidoService {
    DetallePedidoDto crear(DetallePedidoCreate dpc);
    DetallePedidoDto actualizar(Long id, DetallePedidoEdit pe);
    DetallePedidoDto buscaId(Long id);
    List<DetallePedidoDto> buscarTodos();
    void eliminar(Long id);
}
