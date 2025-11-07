package com.example.foodstoreB.repository;

import com.example.foodstoreB.entity.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
    List<DetallePedido> findAllByEliminadoFalse();
}
