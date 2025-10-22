package com.ge.relaciones.service;



import com.ge.relaciones.entity.dto.foto.FotoCreate;
import com.ge.relaciones.entity.dto.foto.FotoDto;
import com.ge.relaciones.entity.dto.foto.FotoEdit;

import java.util.List;

public interface FotoService {
    public FotoDto save (FotoCreate d);
    public FotoDto edit (FotoEdit d, Long id);
    public FotoDto findById(Long id);
    public List<FotoDto> findAll();
    public void delete(Long id);
}
