package com.example.foodstoreB.controller;

import com.example.foodstoreB.entity.dto.PedidoCancelado;
import com.example.foodstoreB.entity.dto.PedidoCreate;
import com.example.foodstoreB.entity.dto.PedidoEdit;
import com.example.foodstoreB.service.PedidoServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/pedido")
public class PedidoController {
    @Autowired
    PedidoServiceImp pedidoService;

    @PostMapping("/crear")
    public ResponseEntity<?> crear (@RequestBody PedidoCreate pc){
        try {
            return ResponseEntity.ok().body(pedidoService.crear(pc));
            }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody PedidoEdit pedidoEdit){
        try{
            return ResponseEntity.ok().body(pedidoService.actualizar(id, pedidoEdit));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());

        }
    }

    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<?> borrar(@PathVariable Long id){
        try{
            pedidoService.eliminar(id);
            return ResponseEntity.ok().body("Entidad eliminada");
            }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @GetMapping("/buscarTodos/{id}")
    public ResponseEntity<?> buscarTodos(@PathVariable Long id){
        try {
            return ResponseEntity.ok().body(pedidoService.buscarTodos(id));
            }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @GetMapping("/buscarId/{id}")
    public ResponseEntity<?> buscaId(@PathVariable Long id){
        try{
            return ResponseEntity.ok(pedidoService.buscaId(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @GetMapping("/busquedaAdmin")
    public ResponseEntity<?> busquedaAdmin(){
        try {
            return ResponseEntity.ok().body(pedidoService.busquedaAdmin());
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @PutMapping("/cancelarPedido/{id}")
    public ResponseEntity<?> cancelarPedido(@PathVariable Long id, @RequestBody PedidoCancelado pc){
        try {
            return ResponseEntity.ok().body(pedidoService.cancelarPedido(id, pc));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }
}
