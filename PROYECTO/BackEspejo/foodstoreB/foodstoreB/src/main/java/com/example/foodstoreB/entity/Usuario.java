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
public class Usuario extends Base{

    @Column(nullable = false)
    private String nombre;
    private String apellido;

    @Column(nullable = false, unique = true)
    private String mail;

    private String celular;

    private String contrasena;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Rol rol = Rol.USUARIO;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Pedido> pedidos = new ArrayList<>();

}
