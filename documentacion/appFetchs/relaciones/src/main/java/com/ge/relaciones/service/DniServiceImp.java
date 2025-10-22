package com.ge.relaciones.service;

import com.ge.relaciones.entity.Dni;
import com.ge.relaciones.entity.dto.dni.DniCreate;
import com.ge.relaciones.entity.dto.dni.DniDto;
import com.ge.relaciones.entity.dto.dni.DniEdit;
import com.ge.relaciones.entity.dto.mapper.DniMapper;
import com.ge.relaciones.repository.DniRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DniServiceImp implements DniService {

    @Autowired
    DniRepository dniRepository;

    @Override
    public DniDto save(DniCreate d) {
        Dni dni = DniMapper.toEntity(d);
        dni = dniRepository.save(dni);
        return DniMapper.toDto(dni);
    }

    @Override
    public DniDto edit(DniEdit d, Long id) {
        Dni dni = dniRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DNI no encontrado con ID: " + id));
        System.out.println(dni);
        // Usar el mapper para actualizar
        dni = DniMapper.updateEntity(dni, d);

        // Guardar cambios
        dni = dniRepository.save(dni);

        // Retornar DTO
        return DniMapper.toDto(dni);
    }

    @Override
    public DniDto findById(Long id) {
        Dni dni = dniRepository.findById(id).orElseThrow(() -> new NullPointerException("No se encontro el dni con id " + id));
        return DniMapper.toDto(dni) ;
    }

    @Override
    public List<DniDto> findAll() {
        return dniRepository.findAll().stream().map(DniMapper::toDto).toList();
    }

    @Override
    public void delete(Long id) {
        dniRepository.deleteById(id);
    }
}
