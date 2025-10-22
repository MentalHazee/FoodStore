package com.ge.relaciones.entity.dto.mapper;

import com.ge.relaciones.entity.Foto;
import com.ge.relaciones.entity.dto.foto.FotoCreate;
import com.ge.relaciones.entity.dto.foto.FotoDto;

public class FotoMapper {
    public static Foto toEntity(FotoCreate fotoCreate){
        Foto foto = new Foto();
        foto.setNombre(fotoCreate.nombre());
        foto.setUrl(fotoCreate.url());
        return foto;
    }

    public static FotoDto toDto(Foto foto){
        return new FotoDto(foto.getId(), foto.getNombre(), foto.getUrl());
    }
}
