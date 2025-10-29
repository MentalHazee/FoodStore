package com.example.foodstoreB.controller;

import com.example.foodstoreB.entity.dto.CategoriaCreate;
import com.example.foodstoreB.entity.dto.CategoriaEdit;
import com.example.foodstoreB.impl.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/categoria")
public class CategoriaController {
    @Autowired
    CategoriaService categoriaService;

    @PostMapping("/crear")
    public ResponseEntity<?> crear (@RequestBody CategoriaCreate cc){
        try {
            return ResponseEntity.ok().body(categoriaService.crear(cc));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody CategoriaEdit categoriaEdit){
        try{
            return ResponseEntity.ok().body(categoriaService.actualizar(id, categoriaEdit));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<?> borrar(@PathVariable Long id){
        try{
            categoriaService.eliminar(id);
            return ResponseEntity.ok().body("Entidad eliminada");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @GetMapping("/buscarTodos")
    public ResponseEntity<?> buscarTodos(){
        try {
            return ResponseEntity.ok().body(categoriaService.buscarTodos());
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }

    @GetMapping("/buscarId/{id}")
    public ResponseEntity<?> buscaId(@PathVariable Long id){
        try{
            return ResponseEntity.ok(categoriaService.buscaId(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " +e.getMessage());
        }
    }
}
