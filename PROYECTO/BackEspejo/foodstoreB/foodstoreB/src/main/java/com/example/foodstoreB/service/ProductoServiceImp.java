package com.example.foodstoreB.service;

import com.example.foodstoreB.entity.Categoria;
import com.example.foodstoreB.entity.Producto;
import com.example.foodstoreB.entity.dto.*;
import com.example.foodstoreB.entity.dto.ProductoAdminDto;
import com.example.foodstoreB.entity.mapper.ProductoMapper;
import com.example.foodstoreB.impl.ProductoService;
import com.example.foodstoreB.repository.CategoriaRepository;
import com.example.foodstoreB.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class ProductoServiceImp implements ProductoService {
    @Autowired
    ProductoRepository productoRepository;
    @Autowired
    CategoriaRepository categoriaRepository;

    @Override
    public ProductoAdminDto crear(ProductoCreate pc) {
        Producto producto = ProductoMapper.toEntity(pc, categoriaRepository); // ProductoCreate tiene id de categoria
        return ProductoMapper.toAdminDto(productoRepository.save(producto));
    }

    @Override
    public ProductoAdminDto actualizar(Long id, ProductoEdit pe) {
        Producto producto = productoRepository.findById(id).orElseThrow(()-> new RuntimeException("Producto no encontrado"));
        Categoria categoria = categoriaRepository.findById(pe.getIdCategoria()) //Obtener la categoría por su ID
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + pe.getIdCategoria()));
        producto.setNombre(pe.getNombre());
        producto.setPrecio(pe.getPrecio());
        producto.setCategoria(categoria);
        producto.setDescripcion(pe.getDescripcion());
        producto.setImagen(pe.getImagen());
        producto.setStock(pe.getStock());
        return ProductoMapper.toAdminDto(productoRepository.save(producto));
    }

    @Override
    public ProductoAdminDto buscaId(Long id) {
        Producto producto = productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return ProductoMapper.toAdminDto(producto);
    }

    @Override
    public List<ProductoAdminDto> buscarTodos() {
        List<Producto> productos = productoRepository.findAllByEliminadoFalse();
        return productos.stream()
                .map(ProductoMapper::toAdminDto)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        producto.setEliminado(true);
    }
}
