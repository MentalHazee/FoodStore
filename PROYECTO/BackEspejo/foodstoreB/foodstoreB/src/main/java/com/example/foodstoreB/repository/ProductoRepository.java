package com.example.foodstoreB.repository;

import com.example.foodstoreB.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findAllByEliminadoFalse();
}
