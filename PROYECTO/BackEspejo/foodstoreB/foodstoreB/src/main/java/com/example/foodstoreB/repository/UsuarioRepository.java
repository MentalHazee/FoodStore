package com.example.foodstoreB.repository;

import com.example.foodstoreB.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByMail(String mail);
    boolean existsByMail(String mail);
    List<Usuario> findAllByEliminadoFalse();
}
