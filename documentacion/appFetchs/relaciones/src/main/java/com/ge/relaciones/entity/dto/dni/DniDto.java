package com.ge.relaciones.entity.dto.dni;

import com.ge.relaciones.entity.dto.foto.FotoDto;

public record DniDto (
        Long id,
        String nombre,
        int numero,
        String fechaCreacion,
        String fechaVencimiento,
        FotoDto foto
) {
}
