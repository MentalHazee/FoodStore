package com.example.foodstoreB.service;

import com.example.foodstoreB.entity.Usuario;
import com.example.foodstoreB.entity.dto.UsuarioCreate;
import com.example.foodstoreB.entity.dto.UsuarioDto;
import com.example.foodstoreB.entity.dto.UsuarioEdit;
import com.example.foodstoreB.entity.mapper.UsuarioMapper;
import com.example.foodstoreB.impl.UsuarioService;
import com.example.foodstoreB.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UsuarioServiceImp implements UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Override
    public UsuarioDto crear(UsuarioCreate uc) {
        Usuario usuario = UsuarioMapper.toEntity(uc);
        Usuario usuarioEntidad = usuarioRepository.save(usuario);
        return UsuarioMapper.toDTO(usuarioEntidad);
    }

    @Override
    public UsuarioDto actualizar(Long id, UsuarioEdit ue) {
        Usuario usuarioExistente = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        usuarioExistente.setMail(ue.getMail());
        usuarioExistente.setCelular(ue.getCelular());
        usuarioExistente.setContrasena(ue.getContrasena());
        Usuario usuarioActualizado = usuarioRepository.save(usuarioExistente);
        return UsuarioMapper.toDTO(usuarioActualizado);
    }

    @Override
    public UsuarioDto buscaId(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return UsuarioMapper.toDTO(usuario);
    }

    @Override
    public List<UsuarioDto> buscaTodos() {
        List<Usuario> usuarios = usuarioRepository.findAllByEliminadoFalse();
        return usuarios.stream()
                .map(UsuarioMapper::toDTO)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        usuario.setEliminado(true);
    }
}