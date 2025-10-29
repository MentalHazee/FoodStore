package com.example.foodstoreB.repository;

import com.example.foodstoreB.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findAllByEliminadoFalse();
}
