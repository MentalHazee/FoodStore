package com.example.foodstoreB.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Pedido extends Base{

    @Builder.Default
    private LocalDateTime fecha = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);

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

    private String phone;
    private String address;
    private String paymentMethod;
    private String notes;

}
