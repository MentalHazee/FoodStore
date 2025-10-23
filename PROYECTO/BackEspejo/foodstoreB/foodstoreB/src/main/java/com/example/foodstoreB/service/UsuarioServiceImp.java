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

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;

@Service
@Transactional
public class UsuarioServiceImp implements UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Override
    public UsuarioDto crear(UsuarioCreate uc) {
        Usuario usuario = UsuarioMapper.toEntity(uc);
        Usuario usuarioEntidad = usuario;
        usuarioEntidad.setContrasena(hashPassword(usuario.getContrasena()));
        Usuario usuarioEncriptado = usuarioRepository.save(usuarioEntidad);
        return UsuarioMapper.toDTO(usuarioEncriptado);
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

    private String hashPassword(String password) {
        try {
            // Obtener la instancia del algoritmo SHA-256
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // Aplicar el hash a la contraseña
            byte[] hash = digest.digest(password.getBytes());

            // Convertir el array de bytes a una cadena hexadecimal
            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            // Esto solo ocurre si el algoritmo SHA-256 no existe (muy raro)
            throw new RuntimeException("Error al hashear la contraseña con SHA-256", e);
        }
    }
}