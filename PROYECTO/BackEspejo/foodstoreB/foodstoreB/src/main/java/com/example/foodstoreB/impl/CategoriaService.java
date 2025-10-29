package com.example.foodstoreB.impl;

import com.example.foodstoreB.entity.dto.CategoriaCreate;
import com.example.foodstoreB.entity.dto.CategoriaAdminDto;
import com.example.foodstoreB.entity.dto.CategoriaEdit;

import java.util.List;

public interface CategoriaService {
    CategoriaAdminDto crear(CategoriaCreate cc);
    CategoriaAdminDto actualizar(Long id, CategoriaEdit ce);
    CategoriaAdminDto buscaId(Long id);
    List<CategoriaAdminDto> buscarTodos();
    void eliminar(Long id);
}
