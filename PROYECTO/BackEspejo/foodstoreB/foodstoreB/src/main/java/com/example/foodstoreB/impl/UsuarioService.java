package com.example.foodstoreB.impl;

import com.example.foodstoreB.entity.dto.*;

import java.util.List;

public interface UsuarioService {
    UsuarioDto crear(UsuarioCreate c);
    UsuarioDto actualizar(Long id, UsuarioEdit p);
    UsuarioDto buscaId(Long id);
    List<UsuarioDto> buscarTodos();
    void eliminar(Long id);
    UsuarioDto login(UsuarioLogin ul) throws Exception;
    void crear();
}
