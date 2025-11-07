package com.example.foodstoreB.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private LocalDate fecha = LocalDate.now();

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.PENDIENTE;
    private Double total;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // Usamos CascadeType.ALL para indicar que los detalles se guardan/borran con el pedido.
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    @Builder.Default
    private List<DetallePedido> detalles = new ArrayList<>();

    @Builder.Default
    private boolean eliminado = false;
}
