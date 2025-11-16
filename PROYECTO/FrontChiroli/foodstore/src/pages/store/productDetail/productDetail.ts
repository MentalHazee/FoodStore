//import { getCurrentUser } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";
import { getProductoById } from "../../../utils/api";
import { addToCart } from "../../../utils/cart";
import type { IProduct } from "../../../types/IProduct";

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) {
    alert('Producto no especificado');
    window.location.href = '/src/pages/store/home/home.html';
    return;
  }
   try {
    const product = await getProductoById(Number(id));
    renderProductDetail(product);
  } catch (error) {
    alert('Producto no encontrado');
    window.location.href = '/src/pages/store/home/home.html';
  }
});

function renderProductDetail(product: IProduct): void {
  const container = document.getElementById('productContainer'); // El contenedor principal del detalle
    if (!container) {
        console.error("No se encontró el contenedor '#productContainer'.");
        return;
    }

    // --- Generar el HTML completo del detalle del producto ---
    const productDetailHtml = `
        <div class="product-detail-content">
            <img id="productImage" src="" alt="" width="300" class="product-detail-image" />
            <div class="product-info">
                <h1 id="productName"></h1>
                <p id="productDescription" class="product-description"></p>
                <p id="productPrice" class="product-price"></p>
                <p id="productStock" class="product-stock"></p>
                <p id="productStatus" class="product-status"></p>

                <div class="product-actions">
                    <div class="quantity-selector">
                        <label for="quantity">Cantidad:</label>
                        <input type="number" id="quantity" name="quantity" value="1" min="1" max="1" />
                    </div>
                    <button id="addToCartBtn" class="btn btnPrimary">Agregar al Carrito</button>
                </div>
            </div>
        </div>
    `;

    // --- Insertar el HTML generado en el contenedor ---
    container.innerHTML = productDetailHtml;

  // --- Verificar y castear el elemento de la imagen ---
  const imageElement = document.getElementById('productImage');
  if (imageElement && imageElement instanceof HTMLImageElement) {
    imageElement.src = product.imagen;
  } else {
    console.error("No se encontró el elemento <img> con ID 'productImage' o no es una etiqueta <img>.");
    // Opcional: Mostrar imagen por defecto
    // const defaultImg = document.createElement('img');
    // defaultImg.src = '/path/to/default-image.jpg';
    // defaultImg.alt = 'Imagen no disponible';
    // document.getElementById('someContainer')?.appendChild(defaultImg);
  }

  // --- Verificar y actualizar otros elementos de texto ---
  const nameElement = document.getElementById('productName');
  if (nameElement) {
    nameElement.textContent = product.nombre;
  } else {
    console.error("No se encontró el elemento con ID 'productName'.");
  }

  const descriptionElement = document.getElementById('productDescription');
  if (descriptionElement) {
    descriptionElement.textContent = product.descripcion;
  } else {
    console.error("No se encontró el elemento con ID 'productDescription'.");
  }

  const priceElement = document.getElementById('productPrice');
  if (priceElement) {
    priceElement.textContent = `$${product.precio.toFixed(2)}`;
  } else {
    console.error("No se encontró el elemento con ID 'productPrice'.");
  }

  const stockElement = document.getElementById('productStock');
  if (stockElement) {
    stockElement.textContent = `Stock: ${product.stock}`;
  } else {
    console.error("No se encontró el elemento con ID 'productStock'.");
  }

  // --- Verificar y actualizar el estado de disponibilidad ---
  const statusElement = document.getElementById('productStatus');
  const isAvailable = product.stock > 0;

  if (statusElement) {
    statusElement.textContent = isAvailable ? 'Disponible' : 'Agotado';
    statusElement.className = isAvailable ? 'status available' : 'status unavailable';
  } else {
    console.error("No se encontró el elemento con ID 'productStatus'.");
  }

  // --- Verificar y manipular botón de agregar al carrito ---
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn && addToCartBtn instanceof HTMLButtonElement) { // Asegura que sea un botón
    addToCartBtn.disabled = !isAvailable;
  } else {
    console.error("No se encontró el botón con ID 'addToCartBtn' o no es un elemento <button>.");
  }

  // --- Verificar y manipular input de cantidad ---
  const quantityInput = document.getElementById('quantity');
  if (quantityInput && quantityInput instanceof HTMLInputElement) { // Asegura que sea un input
    quantityInput.max = product.stock.toString();
    quantityInput.min = '1';
    quantityInput.value = '1'; // Valor inicial
  } else {
    console.error("No se encontró el input con ID 'quantity' o no es un elemento <input>.");
  }

  // Evento para agregar al carrito
  document.getElementById('addToCartBtn')?.addEventListener('click', async () => {
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;
    const quantity = parseInt(quantityInput.value, 10);

    // Obtener producto actual (necesitas accederlo de nuevo o guardarlo en una variable global si es necesario)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) return;

    try {
      const product = await getProductoById(Number(id));

      // Validaciones antes de agregar
      if (!product.stock) { // <-- Validar si está inactivo
        alert('El producto no está disponible.');
        return;
      }

      if (quantity <= 0) {
        alert('La cantidad debe ser mayor a 0.');
        return;
      }

      if (quantity > product.stock) { // <-- Validar stock
        alert(`Solo hay ${product.stock} unidades disponibles.`);
        return;
      }

      // Agregar al carrito (usando la función que sincroniza con el back-end)
      await addToCart(product.id, product.nombre, product.precio, product.imagen, quantity);

      // Mensaje de confirmación
      alert(`¡${quantity}x ${product.nombre} agregado(s) al carrito!`);

      // Opcional: Actualizar badge del carrito en la navbar si es necesario
      // updateCartBadge();

    } catch (error) {
      alert('Error al agregar al carrito: ' + (error as Error).message);
    }
  });

  // Botón "Volver"
  document.getElementById('backButton')?.addEventListener('click', () => {
    navigateTo('/src/pages/store/home/home.html'); // O history.back() si prefieres
  });
}



