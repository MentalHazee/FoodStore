package com.ge.relaciones.entity.dto.dni;

import com.ge.relaciones.entity.dto.foto.FotoCreate;

public record DniCreate (
        String nombre,
        int numero,
        String fechaVencimiento,
        FotoCreate foto
) {
}
