package com.example.foodstoreB.impl;

import com.example.foodstoreB.entity.Estado;
import com.example.foodstoreB.entity.dto.ProductoAdminDto;
import com.example.foodstoreB.entity.dto.ProductoCreate;
import com.example.foodstoreB.entity.dto.ProductoEdit;
import com.example.foodstoreB.entity.dto.ProductoStockEdit;

import java.util.List;

public interface ProductoService {
    ProductoAdminDto crear(ProductoCreate pc);
    ProductoAdminDto actualizar(Long id, ProductoEdit pe);
    ProductoAdminDto buscaId(Long id);
    List<ProductoAdminDto> buscarTodos();
    void eliminar(Long id);
    void actualizarStock(Long id, ProductoStockEdit pse);
}
