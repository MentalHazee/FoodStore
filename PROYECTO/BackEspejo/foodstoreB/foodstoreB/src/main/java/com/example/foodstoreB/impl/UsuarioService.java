package com.example.foodstoreB.impl;

import com.example.foodstoreB.entity.dto.UsuarioCreate;
import com.example.foodstoreB.entity.dto.UsuarioDto;
import com.example.foodstoreB.entity.dto.UsuarioEdit;

import java.util.List;

public interface UsuarioService {
    UsuarioDto crear(UsuarioCreate c);
    UsuarioDto actualizar(Long id, UsuarioEdit p);
    UsuarioDto buscaId(Long id);
    List<UsuarioDto> buscaTodos();
    void eliminar(Long id);
}
