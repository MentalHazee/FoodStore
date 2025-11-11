package com.example.foodstoreB.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Categoria extends Base{

    @Column(nullable = false)
    private String nombre;
    private String descripcion;
    private String imagen;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Producto> productos = new ArrayList<>();

}
