package com.ge.relaciones.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Dni extends Base{
    private String nombre;
    private int numero;
    @Builder.Default
    private String fechaCreacion = LocalDate.now().toString();
    private String fechaVencimiento;

    @OneToOne(cascade = CascadeType.PERSIST)
    private Foto foto;

}
