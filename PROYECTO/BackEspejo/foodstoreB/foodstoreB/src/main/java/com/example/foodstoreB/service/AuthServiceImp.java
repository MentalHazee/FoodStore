package com.example.foodstoreB.service;

import com.example.foodstoreB.entity.Sha256Util;
import com.example.foodstoreB.entity.Usuario;
import com.example.foodstoreB.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class AuthServiceImp {
    @Autowired
    private static UsuarioRepository UsuarioRepository;
    public static Usuario register(Usuario u) {
        u.setContrasena(Sha256Util.hash(u.getContrasena()));
        return UsuarioRepository.save(u);
    }

}
