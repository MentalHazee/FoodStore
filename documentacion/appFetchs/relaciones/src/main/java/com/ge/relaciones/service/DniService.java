package com.ge.relaciones.service;

import com.ge.relaciones.entity.Dni;
import com.ge.relaciones.entity.dto.dni.DniCreate;
import com.ge.relaciones.entity.dto.dni.DniDto;
import com.ge.relaciones.entity.dto.dni.DniEdit;

import java.util.List;

public interface DniService {
    public DniDto save (DniCreate d);
    public DniDto edit (DniEdit d, Long id);
    public DniDto findById(Long id);
    public List<DniDto> findAll();
    public void delete(Long id);
}
