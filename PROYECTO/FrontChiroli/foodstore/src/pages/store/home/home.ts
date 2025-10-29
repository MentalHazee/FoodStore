import {getCategorias, getProductos} from "../../../utils/api";
import type {ICategoria} from "../../../types/ICategoria";
import type {IProduct} from "../../../types/IProduct";

//vaiables globales para mantener el estado en memoria 
let allProductos: IProduct[] = [];//todos los productos cargados
let currentCategoriaId: number | null = null;//categoria seleccionada actualmente

//verificar si el usuario es cliente y ocultar boton de admin
document.addEventListener('DOMContentLoaded', async () => {
    hidenAdminButton();
    try{
        const categorias = await getCategorias();
        allProductos = await getProductos();
        renderCategorias(categorias);
        renderProductos(allProductos);

        const sortSelect = document.getElementById('sortOrder') as HTMLSelectElement;
        sortSelect?.addEventListener('change', () => applyFiltersAndSort());
    }catch (error) {
        console.error('Error al cargar la tienda:', error);
        alert('Error al cargar la tienda. Por favor, intente nuevamente más tarde.');
    }
});

function hidenAdminButton(){
    const adminButton = document.getElementById('adminButton') as HTMLElement | null;
    if (!adminButton) return;
    const rol = localStorage.getItem('rol');
    if (rol === 'ADMIN'){
        adminButton.style.display = '';
    } else {
        adminButton.style.display = 'none';
    }
}

//renderiza las categorias en el sidebar como botones 
function renderCategorias(categorias: ICategoria[]): void {
    const sidebar = document.getElementById('categorySidebar');
    if (!sidebar) return;

    //boton para todas las categorias
    let html = `<button class="category-button" data-id="">Todas las Categorias</button>`;

    //botones para cada categoria
    for (const categoria of categorias) {
        html += `<button class="category-button" data-id="${categoria.id}">${categoria.nombre}</button>`;
    }
    sidebar.innerHTML = html;

    //agregar eventos a los botones
    sidebar.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
            const idAttribute = button.getAttribute('data-id');
            currentCategoriaId = idAttribute ? Number(idAttribute) : null;
            applyFiltersAndSort();
        });
    });
}

//aplicar filtros y ordenamiento
function applyFiltersAndSort(): void {
    //filtrar por categoria
    let filtrarProductos = allProductos;
    if (currentCategoriaId !== null) {
        filtrarProductos = allProductos.filter(p => p.categoriaId === currentCategoriaId);
    }

    //ordenar 
    const sortSelect = document.getElementById('sortOrder') as HTMLSelectElement;
    const sortBy = sortSelect?.value || 'name-asc';
    
    //ordenar y mostrar
    const sorted = sortProducts(filtrarProductos, sortBy);
    renderProductos(sorted);
}

//ordena un array de productos segun criterio
function sortProducts(products: IProduct[], sortBy: string): IProduct[] {
    return [...products].sort((a, b) => {
        if (sortBy === 'name-asc') {
            return a.nombre.localeCompare(b.nombre);//A-Z
        } else if (sortBy === 'name-desc') {
            return b.nombre.localeCompare(a.nombre);//Z-A
        } else if (sortBy === 'price-asc') {
            return a.precio - b.precio;// menor a mayor
        } else if (sortBy === 'price-desc') {
            return b.precio - a.precio;// mayor a menor
        }
        return 0;
    });
}

//renderiza las tarjetas de productos en el contenedor principal
function renderProductos(productos: IProduct[]): void {
    const container = document.getElementById('productGrid');
    if (!container) return;

    //mostrar contador
    const counter = document.getElementById('productCount');
    if (counter) {
        const totalVisible = productos.length;
        const totalAll = currentCategoriaId 
        ? allProductos.filter(p => p.categoriaId === currentCategoriaId).length 
        : allProductos.length;
        counter.textContent = `Mostrando ${totalVisible} de ${totalAll} productos`;
    }

    if (productos.length === 0) {
        container.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
        return;
    }

    //generar tarjetas de productos
    let html = '';
    for (const producto of productos) {
        html += `
        <div class="product-card"> data-id="${producto.id}">
            <img src="${producto.imageURL}" alt="${producto.nombre}" class="product-image"/>
            <h3 class="product-name">${producto.nombre}</h3>
            <p class="product-description">${producto.descripcion}</p>
            <p class="product-price">$${producto.precio.toFixed(2)}</p>
            <span class="product-stock"${producto.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
        </div>
        `;
    }

    container.innerHTML = html;

    //agregar eventos a las tarjetas de productos
    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            window.location.href = `productDetail.html?id=${id}`;
        });
    });
}
