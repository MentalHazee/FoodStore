import { getCart, updateItemCantidad, removeItem, clearCart, calcularTotal, calcularSubtotal } from "../../../utils/cart";
import { getCurrentUser } from "../../../utils/auth";
import { createOrder } from "../../../utils/api";
import { navigateTo } from "../../../utils/navigate";

const envioCosto = 500;

document.addEventListener('DOMContentLoaded', () =>{

    const session = getCurrentUser();
        if (!session){
            console.log("No hay sesion, redirigiendo al login");
            navigateTo('/auth/login/login.html');
        }
        const userNameElement = document.getElementById('userNameHeader');
            if (userNameElement){
                userNameElement.textContent = session?.nombre || session?.mail || 'CLIENTE';
            }
    // 1. Dibuja el estado inicial (items y total)
    renderCart();
    
    // 2. 🌟 Configura los eventos solo UNA VEZ
    setupEventListeners();
});

// ----------------------------------------------------------------------
// 🔄 FUNCIÓN DE RENDERIZADO DE TOTALES (Nueva)
// ----------------------------------------------------------------------

/**
 * Genera y actualiza el HTML dentro del contenedor #totalContainer.
 * Contiene el resumen de totales y los botones principales.
 */
function renderTotals(): void {
    const cart = getCart();
    
    
    const container = document.getElementById('totalContainer');
    if (!container) {
        console.warn("No se encontró el contenedor '#totalContainer'.");
        return;
    }

    if (cart.items.length === 0) {
        container.innerHTML = ''; // Limpiar contenido
        container.style.display = 'none'; // 🌟 Ocultar el div completo
        return;
    }

    container.style.display = 'block';
    
    const subtotal = calcularSubtotal();
    const total = calcularTotal(envioCosto);

    // Generar el HTML completo para el resumen de totales y botones
    container.innerHTML = `
        <div class="cart-summary">
            <h3>Resumen del Pedido</h3>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Envío: $${envioCosto.toFixed(2)}</p>
            <p class="total">Total: $${total.toFixed(2)}</p>
            <div class="cart-buttons">
                <button id="btnClearCart">Vaciar Carrito</button>
                <button id="btnCheckout">Proceder al Pago</button>
            </div>
        </div>
    `;
    
    // Manejar visibilidad del resumen basado en el estado del carrito
    //const cart = getCart();
    const summaryElement = container.querySelector('.cart-summary');
    if (summaryElement) {
        if (cart.items.length === 0) {
            summaryElement.classList.add('hidden');
        } else {
            summaryElement.classList.remove('hidden');
        }
    }
}

// ----------------------------------------------------------------------
// --- Función Principal de Renderizado (Items del Carrito) ---
// ----------------------------------------------------------------------
function renderCart(): void{
    const cart = getCart();

    const container = document.getElementById('cartContainer');
    if (!container) {
        console.error("No se encontró el contenedor '#cartContainer' en el HTML.");
        return;
    }

    // 🌟 Llama a renderTotals() para actualizar el resumen inmediatamente
    renderTotals(); 
    
    // 3. Manejar estado vacío y visibilidad
    if (cart.items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>¡Tu carrito está vacío!</h2>
                <p>Agrega productos antes de proceder al pago.</p>
                <button onclick="location.href='/src/pages/store/home/home.html'">Ir a la tienda</button>
            </div>
        `;
        return;
    } 

    // 4. Calcular valores y generar HTML de los ÍTEMS
    let itemsHtml = '';

    for (const item of cart.items) {
        const itemTotal = item.precio * item.cantidad;
        
        itemsHtml += `
            <div class="cart-item" data-product-id="${item.idProducto}">
                <img src="${item.imagenUrl}" alt="${item.nombre}" width="80" />
                <div class="item-info">
                    <h3>${item.nombre}</h3>
                    <p class="price">$${item.precio.toFixed(2)}</p>
                </div>
                <div class="quantity-control">
                    <button class="qty-btn" data-action="dec">-</button>
                    <span class="qty-value">${item.cantidad}</span>
                    <button class="qty-btn" data-action="inc">+</button>
                </div>
                <p class="item-total">$${itemTotal.toFixed(2)}</p>
                <button class="btn-remove">Eliminar</button>
            </div>
        `;
    }

    // 5. Insertar el HTML generado en el contenedor
    // Solo actualizamos el listado de ítems dentro del contenedor principal
    container.innerHTML = `<div class="cart-items">${itemsHtml}</div>`;
    
    // Eliminamos el código anterior de actualización de spans por ID,
    // ya que ahora todo el resumen se gestiona en renderTotals().
}

// ----------------------------------------------------------------------
// 🌟 FUNCIÓN DE ASIGNACIÓN DE EVENTOS (Solo se llama una vez) 🌟
// ----------------------------------------------------------------------

function setupEventListeners(): void {
    const cartContainerElement = document.getElementById('cartContainer');
    const totalContainerElement = document.getElementById('totalContainer'); // Nuevo contenedor para delegación
    
    // --- 7. Eventos de Ítems (Delegación en #cartContainer) ---
    if (cartContainerElement) {
        cartContainerElement.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const itemDiv = target.closest('.cart-item');
            if (!itemDiv) return;

            const productId = Number(itemDiv.getAttribute('data-product-id'));
            if (isNaN(productId)) return;

            // Lógica de botones de Cantidad y Eliminar...
            if (target.classList.contains('qty-btn')) {
                const action = target.dataset.action;
                const qtyValueSpan = itemDiv.querySelector('.qty-value') as HTMLSpanElement;
                let currentQty = parseInt(qtyValueSpan.textContent || '0', 10);
                let newCantidad = currentQty + (action === 'inc' ? 1 : -1);

                if (newCantidad < 1) {
                    newCantidad = 1;
                } else {
                    updateItemCantidad(productId, newCantidad);
                }
                renderCart();
            }

            if (target.classList.contains('btn-remove')) {
                removeItem(productId);
                renderCart();
            }
        });
    }
    
    // --- Eventos de Botones Superiores (Delegación en #totalContainer) ---
    // Usamos delegación porque renderTotals() reemplaza estos botones cada vez.
    if (totalContainerElement) {
        totalContainerElement.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            
            // Botón "Vaciar Carrito"
            if (target.id === 'btnClearCart') {
                if (confirm('¿Estás seguro de vaciar el carrito?')) {
                    clearCart();
                    renderCart(); // Actualiza ítems y totales
                }
            }

            // Botón "Proceder al Pago"
            if (target.id === 'btnCheckout') {
                const cartActual = getCart();
                if (cartActual.items.length === 0) {
                    alert('El carrito está vacío');
                    return;
                }
                const modal = document.getElementById('checkoutModal');
                if (modal) modal.style.display = 'block';
            }
        });
    }


    // Botón "Cancelar" del Modal (Este no necesita delegación si el modal es estático)
    const btnCancelCheckout = document.getElementById('btnCancelCheckout');
    if (btnCancelCheckout) {
        btnCancelCheckout.addEventListener('click', () => {
            const modal = document.getElementById('checkoutModal');
            if (modal) modal.style.display = 'none';
        });
    }

    // --- Evento del Formulario de Checkout (Este es estático) ---
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // ... (Toda la lógica de checkout, sin cambios) ...
            try {
                const phoneInput = document.getElementById('phone') as HTMLInputElement;
                const addressInput = document.getElementById('address') as HTMLTextAreaElement;
                const paymentMethodSelect = document.getElementById('paymentMethod') as HTMLSelectElement;
                const notesInput = document.getElementById('notes') as HTMLTextAreaElement;

                if (!phoneInput || !addressInput || !paymentMethodSelect) {
                    console.error("No se encontraron campos requeridos del checkout en el HTML.");
                    return;
                }

                const phone = phoneInput.value.trim();
                const address = addressInput.value.trim();
                const paymentMethod = paymentMethodSelect.value as "cash" | "card" | "transfer";
                const notes = notesInput ? notesInput.value.trim() : '';
                
                if (!phone || !address || !paymentMethod) {
                    alert('Por favor completa todos los campos obligatorios (teléfono, dirección, método de pago).');
                    return;
                }
                
                const user = getCurrentUser();
                if (!user) {
                    alert('Sesión expirada. Por favor, inicia sesión.');
                    navigateTo('/src/pages/auth/login/login.html');
                    return;
                }
                
                const cartActual = getCart();
                const orderData = {
                    idUser: user.id,
                    phone,
                    address,
                    paymentMethod,
                    notes: notes || undefined,
                    items: cartActual.items.map(item => ({
                        idProducto: item.idProducto,
                        cantidad: item.cantidad
                    })),
                    total: calcularTotal(envioCosto)
                };

                const response = await createOrder(orderData);

                if (response.ok) {
                    clearCart();
                    navigateTo('/src/pages/client/orders/orders.html');
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText || `Error ${response.status} al crear el pedido`);
                }
            } catch (error) {
                console.error("Error al confirmar el pedido:", error);
                alert('Error al confirmar el pedido: ' + (error as Error).message);
                const modal = document.getElementById('checkoutModal');
                if (modal) modal.style.display = 'none';
            }
        });
    }
}