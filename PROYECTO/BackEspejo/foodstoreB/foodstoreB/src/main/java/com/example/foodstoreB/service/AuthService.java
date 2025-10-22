package com.example.foodstoreB.service;

import com.example.foodstoreB.entity.Sha256Util;
import com.example.foodstoreB.entity.Usuario;
import com.example.foodstoreB.repository.UsuarioRepository;

public class AuthService {
    public static Usuario register(Usuario u) {
        u.setContrasena(Sha256Util.hash(u.getContrasena()));
        return UsuarioRepository.save(u);
    }

}
