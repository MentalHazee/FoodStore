package com.example.foodstoreB.service;

import com.example.foodstoreB.entity.Categoria;
import com.example.foodstoreB.entity.dto.CategoriaCreate;
import com.example.foodstoreB.entity.dto.CategoriaAdminDto;
import com.example.foodstoreB.entity.dto.CategoriaEdit;
import com.example.foodstoreB.entity.mapper.CategoriaMapper;
import com.example.foodstoreB.impl.CategoriaService;
import com.example.foodstoreB.repository.CategoriaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CategoriaServiceImp implements CategoriaService {
    @Autowired
    CategoriaRepository categoriaRepository;
    @Override
    public CategoriaAdminDto crear(CategoriaCreate cc) {
        Categoria categoria = CategoriaMapper.toEntity(cc);
        return CategoriaMapper.toAdminDto(categoriaRepository.save(categoria));
    }

    @Override
    public CategoriaAdminDto actualizar(Long id, CategoriaEdit ce) {
        Categoria categoria = categoriaRepository.findById(id).orElseThrow(()-> new RuntimeException("Categoria no encontrado"));
        categoria.setNombre(ce.getNombre());
        return CategoriaMapper.toAdminDto(categoriaRepository.save(categoria));
    }

    @Override
    public CategoriaAdminDto buscaId(Long id) {
        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoria no encontrado con ID: " + id));
        return CategoriaMapper.toAdminDto(categoria);
    }

    @Override
    public List<CategoriaAdminDto> buscarTodos() {
        List<Categoria> categorias = categoriaRepository.findAllByEliminadoFalse();
        return categorias.stream()
                .map(CategoriaMapper::toAdminDto)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoria no encontrado con ID: " + id));
        categoria.setEliminado(true);
    }
}
