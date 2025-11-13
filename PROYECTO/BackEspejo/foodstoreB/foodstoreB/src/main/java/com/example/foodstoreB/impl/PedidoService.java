package com.example.foodstoreB.impl;

import com.example.foodstoreB.entity.dto.PedidoCancelado;
import com.example.foodstoreB.entity.dto.PedidoCreate;
import com.example.foodstoreB.entity.dto.PedidoDto;
import com.example.foodstoreB.entity.dto.PedidoEdit;

import java.util.List;

public interface PedidoService {
    PedidoDto crear(PedidoCreate pc);
    PedidoDto actualizar(Long id, PedidoEdit pe);
    PedidoDto buscaId(Long id);
    List<PedidoDto> busquedaAdmin();
    void eliminar(Long id);
    List<PedidoDto> buscarTodos(Long id);
    PedidoDto cancelarPedido(Long id, PedidoCancelado pc);
}
