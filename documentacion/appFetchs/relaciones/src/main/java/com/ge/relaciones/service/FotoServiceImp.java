package com.ge.relaciones.service;

import com.ge.relaciones.entity.Foto;
import com.ge.relaciones.entity.dto.foto.FotoCreate;
import com.ge.relaciones.entity.dto.foto.FotoDto;
import com.ge.relaciones.entity.dto.foto.FotoEdit;
import com.ge.relaciones.entity.dto.mapper.FotoMapper;
import com.ge.relaciones.repository.FotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FotoServiceImp implements FotoService {

    @Autowired
    FotoRepository fotoRepository;
    @Override
    public FotoDto save(FotoCreate d) {
        Foto f = FotoMapper.toEntity(d);
        f = fotoRepository.save(f);
        return FotoMapper.toDto(f);
    }

    @Override
    public FotoDto edit(FotoEdit d, Long id) {
        return null;
    }

    @Override
    public FotoDto findById(Long id) {
        Foto f = fotoRepository.findById(id).orElseThrow(() -> new NullPointerException("No se encontro la foto con id " + id));
        return FotoMapper.toDto(f);
    }

    @Override
    public List<FotoDto> findAll() {
        return fotoRepository.findAll().stream().map(FotoMapper::toDto).toList();
    }

    @Override
    public void delete(Long id) {
    fotoRepository.deleteById(id);
    }
}
