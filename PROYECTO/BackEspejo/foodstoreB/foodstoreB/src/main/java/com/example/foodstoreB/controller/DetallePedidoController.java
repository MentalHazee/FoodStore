package com.example.foodstoreB.controller;

import com.example.foodstoreB.entity.dto.DetallePedidoCreate;
import com.example.foodstoreB.entity.dto.DetallePedidoEdit;
import com.example.foodstoreB.entity.dto.PedidoCreate;
import com.example.foodstoreB.entity.dto.PedidoEdit;
import com.example.foodstoreB.service.DetallePedidoServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/detalle")
public class DetallePedidoController {
    @Autowired
    DetallePedidoServiceImp detallePedidoService;

    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody DetallePedidoCreate dpc) {
        try {
            return ResponseEntity.ok().body(detallePedidoService.crear(dpc));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrio un error " + e.getMessage());
        }
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody DetallePedidoEdit detallePedidoEdit) {
        try {
            return ResponseEntity.ok().body(detallePedidoService.actualizar(id, detallePedidoEdit));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrio un error " + e.getMessage());

        }
    }

    @GetMapping("/buscarTodos")
    public ResponseEntity<?> buscarTodos() {
        try {
            return ResponseEntity.ok().body(detallePedidoService.buscarTodos());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrio un error " + e.getMessage());
        }
    }

    @GetMapping("/buscarId/{id}")
    public ResponseEntity<?> buscaId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(detallePedidoService.buscaId(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrio un error " + e.getMessage());
        }
    }

    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<?> borrar(@PathVariable Long id) {
        try {
            detallePedidoService.eliminar(id);
            return ResponseEntity.ok().body("Entidad eliminada");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrio un error " + e.getMessage());
        }
    }
}