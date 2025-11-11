package com.example.foodstoreB.controller;

import com.example.foodstoreB.entity.dto.ProductoCreate;
import com.example.foodstoreB.entity.dto.ProductoEdit;
import com.example.foodstoreB.impl.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/producto")
public class ProductoController {
    @Autowired
    ProductoService productoService;

    @PostMapping("/crear")
    public ResponseEntity<?> crear (@RequestBody ProductoCreate pc){
        try {
            return ResponseEntity.ok().body(productoService.crear(pc));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ProductoEdit productoEdit){
        try{
            return ResponseEntity.ok().body(productoService.actualizar(id, productoEdit));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<?> borrar(@PathVariable Long id){
        try{
            productoService.eliminar(id);
            return ResponseEntity.ok().body("Entidad eliminada");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @GetMapping("/buscarTodos")
    public ResponseEntity<?> buscarTodos(){
        try {
            return ResponseEntity.ok().body(productoService.buscarTodos());
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @GetMapping("/buscarId/{id}")
    public ResponseEntity<?> buscaId(@PathVariable Long id){
        try{
            return ResponseEntity.ok(productoService.buscaId(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }
}
