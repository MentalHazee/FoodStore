package com.ge.relaciones.repository;

import com.ge.relaciones.entity.Foto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FotoRepository extends JpaRepository<Foto,Long> {
    List<Foto> id(Long id);
}
