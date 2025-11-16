import { getCategorias, getProductos } from "../../../utils/api";
import type { ICategoria } from "../../../types/ICategoria";
import type { IProduct } from "../../../types/IProduct";
import { addToCart } from "../../../utils/cart";
import { getCurrentUser} from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";

//vaiables globales para mantener el estado en memoria 
let allProductos: IProduct[] = [];//todos los productos cargados
let currentCategoriaId: number | null = null;//categoria seleccionada actualmente
const DEBOUNCE_DELAY = 300; // Tiempo de espera en milisegundos
let timeoutId: number | undefined;
const debouncedSearch = debounce(performSearch, DEBOUNCE_DELAY);
let currentDisplayedProducts;

document.addEventListener('DOMContentLoaded', async () => {

    const session = getCurrentUser();
        if (!session){
            console.log("No hay sesion, redirigiendo al login");
            navigateTo('/auth/login/login.html');
        }
        const userNameElement = document.getElementById('userNameHeader');
            if (userNameElement){
                userNameElement.textContent = session?.nombre || session?.mail || 'CLIENTE';
            }

    setupAdminButton();
    try {
        const categorias = await getCategorias();
        allProductos = await getProductos();
        renderCategorias(categorias);
        renderProductos(allProductos);

        const sortSelect = document.getElementById('sortOrder') as HTMLSelectElement;
        sortSelect?.addEventListener('change', () => applyFiltersAndSort());
    } catch (error) {
        console.error('Error al cargar la tienda:', error);
        alert('Error al cargar la tienda. Por favor, intente nuevamente más tarde.');
    }
});

/**
 * Si el usuario logueado es ADMIN, crea y añade un botón "Panel Admin" a la barra de navegación.
 * Si no es ADMIN o no hay sesión, no hace nada.
 */
function setupAdminButton() {
    const userStr = localStorage.getItem('user');
    // Si no hay sesión, no hacer nada.
    if (!userStr) return;

    try {
        const user = JSON.parse(userStr);

        // Solo si el rol es ADMIN, procedemos a crear y añadir el botón.
        if (user && user.rol === 'ADMIN') {
            const navContainer = document.querySelector('.header-nav');
            if (!navContainer) return;

            // Crear el nuevo botón como un elemento 'a'
            const adminButton = document.createElement('a');
            adminButton.href = "/src/pages/admin/adminHome/adminHome.html";
            adminButton.id = "adminPanelButton";
            adminButton.className = "active adminButton";
            adminButton.textContent = "Panel Admin";

            // Insertarlo después del enlace "Tienda"
            const tiendaLink = navContainer.querySelector('a[href*="home.html"]');
            tiendaLink?.insertAdjacentElement('afterend', adminButton);
        }
    } catch (e) {
        // Si el JSON en localStorage es inválido, el botón permanecerá oculto.
        console.error("Error al parsear datos de usuario desde localStorage:", e);
    }
}

//renderiza las categorias en el sidebar como botones 
function renderCategorias(categorias: ICategoria[]): void {
    const sidebar = document.getElementById('categoryList');
    if (!sidebar) return;

    //enlace para todas las categorias
    let html = `<li><a href="#" class="category-link" data-id="">Todas las Categorias</a></li>`;

    //enlaces para cada categoria
    for (const categoria of categorias) {
        html += `<li><a href="#" class="category-link" data-id="${categoria.id}">${categoria.nombre}</a></li>`;
    }

    let pedidos = `<li><a href="/src/pages/client/orders/orders.html" class="category-link">Pedidos</a></li>`;
    sidebar.innerHTML = html + pedidos;

    //agregar eventos a los botones
    sidebar.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', () => {
            const idAttribute = link.getAttribute('data-id');
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
        filtrarProductos = allProductos.filter(p => p.idCategoria === currentCategoriaId);
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
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    //mostrar contador
    const counter = document.getElementById('productCount');
    if (counter) {
        const totalVisible = productos.length;
        const totalAll = currentCategoriaId
            ? allProductos.filter(p => p.idCategoria === currentCategoriaId).length
            : allProductos.length;
        counter.textContent = `Mostrando ${totalVisible} de ${totalAll} productos`;
    }

    if (productos.length === 0) {
        grid.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
    }

    //generar tarjetas de productos
    grid.innerHTML = productos.map((producto, i) => {
        const disponible = producto.stock > 0;
        return `
         <div class="product-card" data-id="${producto.id}">
            <img src="${producto.imagen || '/assets/default-product.png'}" alt="${producto.nombre}" />
            <h3>${producto.nombre}</h3>
            <p class="description">${producto.descripcion}</p>
            <p class="price">$${producto.precio.toFixed(2)}</p>

            <span class="badge ${disponible ? 'available' : 'unavailable'}">
              ${disponible ? 'Disponible' : 'Agotado'}
            </span>
            <a href="/src/pages/store/productDetail/productDetail.html?id=${producto.id}">Ver detalle</a>
            ${disponible ? `<button id="boton-producto-${i}" class="btnPrimary">Agregar al carrito</button>` : `<button class="btn-add-cart disabled" disabled>No disponible</button>`}
        </div>
    `;
    }).join('');

    setupSearchListener();
    
    /* if (productos.length > 0) {
        productos.forEach((producto, i) => {
            const boton = document.getElementById(`boton-producto-${i}`);
            boton?.addEventListener('click', (ev) => funcionBoton(i, productos));
    })}*/

    /*  const botones = document.getElementById('boton-producto');
      console.log(botones);

      botones.addEventListener('click', (e) => {
          console.log(e);
      })*/

    /* botones.forEach(boton => {
         boton.addEventListener('click', (e) => {
             console.log(e);
         })
     });*/


    //grid.querySelectorAll('.product-card').forEach(card => {
    //  card.addEventListener('click', () => {
    //    const id = card.getAttribute('data-id');
    //  window.location.href = `/pages/store/product/productDetail.html?id=${id}`;
    //});
    //});
}

function funcionBoton(e: number, productos: IProduct[]): void {
    addToCart(productos[e].id, productos[e].nombre, productos[e].precio, productos[e].imagen, 1);       
}

function performSearch(query: string): void {
    const lowerCaseQuery = query.toLowerCase().trim();

    if (lowerCaseQuery.length < 1) {
        // Muestra todos los productos si la consulta está vacía
        currentDisplayedProducts = allProductos;
    } else {
        // 🌟 Filtrado en el Front-end
        const filteredResults = allProductos.filter(product => {
            // Busca si el nombre o cualquier otro campo relevante CONTIENE la cadena
            const productName = product.nombre.toLowerCase();
            return productName.includes(lowerCaseQuery);
        });
        currentDisplayedProducts = filteredResults;
    }

    renderProductos(currentDisplayedProducts);
}

    function setupSearchListener() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value;
            // Llama a la versión Debounced de la búsqueda
            debouncedSearch(query);
        });
    } else {
        console.warn("Elemento 'searchInput' no encontrado. La búsqueda no funcionará.");
    }
}

    function debounce<T extends any[]>(func: (...args: T) => void, delay: number) {
    return (...args: T) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}
