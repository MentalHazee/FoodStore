package com.ge.relaciones.controller;

import com.ge.relaciones.entity.dto.dni.DniCreate;
import com.ge.relaciones.entity.dto.dni.DniEdit;
import com.ge.relaciones.service.DniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin("*")
@RequestMapping("/dni")
public class DniController {

    @Autowired
    DniService dniService;

    @PostMapping
    public ResponseEntity<?> create (@RequestBody DniCreate dni){
        try{
            return ResponseEntity.ok(dniService.save(dni));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " + e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update (@RequestBody DniEdit dni, @PathVariable Long id){
        try{
            return ResponseEntity.ok(dniService.edit(dni, id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> findAll (){
        try{
            return ResponseEntity.ok(dniService.findAll());
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " + e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity getByID (@PathVariable Long id){
        try{
            return ResponseEntity.ok(dniService.findById(id));

        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " + e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity delete (@PathVariable Long id){
        try{
            dniService.delete(id);
            return ResponseEntity.ok().build();
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Ocurrio un error " + e.getMessage());
        }
    }
}
