package com.ge.relaciones.repository;

import com.ge.relaciones.entity.Dni;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DniRepository extends JpaRepository<Dni, Long> {
}
