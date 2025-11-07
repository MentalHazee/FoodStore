package com.example.foodstoreB.repository;

import com.example.foodstoreB.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findAllByEliminadoFalse();
}
