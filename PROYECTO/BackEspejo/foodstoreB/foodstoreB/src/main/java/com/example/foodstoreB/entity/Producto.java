package com.example.foodstoreB.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString(exclude = "categoria")
public class Producto extends Base{

    @Column(nullable = false)
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagen;
    private int stock;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}
