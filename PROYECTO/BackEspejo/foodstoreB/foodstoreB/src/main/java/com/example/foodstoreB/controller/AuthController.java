package com.example.foodstoreB.controller;

import com.example.foodstoreB.entity.Usuario;
import com.example.foodstoreB.service.AuthServiceImp;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody Usuario u) {
        return ResponseEntity.status(201).body(AuthServiceImp.register(u));
    }

}
