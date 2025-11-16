import { getCart, updateItemCantidad, removeItem, clearCart, calcularTotal, calcularSubtotal } from "../../../utils/cart";
import { getCurrentUser } from "../../../utils/auth";
import { createOrder } from "../../../utils/api";
import { navigateTo } from "../../../utils/navigate";
import { modalCancelarPedido } from "../../../utils/order";
const API_URL = 'http://localhost:8080';

const envioCosto = 500; 

document.addEventListener('DOMContentLoaded', () => {
    const session = getCurrentUser();
    if (!session) {
        console.log("No hay sesion, redirigiendo al login");
        navigateTo('/src/pages/auth/login/login.html');
        return; // Importante salir si no hay sesión
    }
    const userNameElement = document.getElementById('userNameHeader');
    if (userNameElement) {
        userNameElement.textContent = session?.nombre || session?.mail || 'CLIENTE'; // Ajusta 'email' o 'mail' según tu IUsers
    }

    setupAdminButton();
    
    // 1. Dibuja el estado inicial (items y total)
    renderCart();

    // 2. Configura los eventos solo UNA VEZ
    setupEventListeners();

    // Agregar evento de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Previene el comportamiento por defecto del onclick
            // Limpia localStorage (simula logout)
            localStorage.removeItem('user');
            // Redirige al login
            navigateTo('/src/pages/auth/login/login.html');
        });
    }
});

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
// ----------------------------------------------------------------------
// --- Función Principal de Renderizado (Items del Carrito) ---
// ----------------------------------------------------------------------
function renderCart(): void {
    const cart = getCart();

    // --- Renderizar Items ---
    const container = document.getElementById('cartContainer');
    if (!container) {
        console.error("No se encontró el contenedor '#cartContainer' en el HTML.");
        return;
    }

    // 3. Manejar estado vacío
    if (cart.items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>¡Tu carrito está vacío!</h2>
                <p>Agrega productos antes de proceder al pago.</p>
                <button class="btnPrimary" onclick="location.href='/src/pages/store/home/home.html'">Ir a la tienda</button>
            </div>
        `;
        // Asegurar que el resumen también se oculte si el carrito está vacío
        renderTotals(); // Esto ocultará #totalContainer si no hay ítems
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

    // 5. Insertar el HTML generado para los ítems en el contenedor
    container.innerHTML = `<div class="cart-items">${itemsHtml}</div>`;

    // --- Renderizar Totales ---
    renderTotals(); // Llama a la función separada para actualizar el resumen
}

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
        container.style.display = 'none'; // Ocultar el div completo si no hay ítems
        return;
    }

    container.style.display = 'block'; // Mostrar si hay ítems

    const subtotal = calcularSubtotal();
    const total = calcularTotal(envioCosto);

    // Generar el HTML completo para el resumen de totales y botones
    container.innerHTML = `
        <div class="cart-summary">
            <h3>Resumen del Pedido</h3>
            <p>Subtotal: $<span id="subtotal">${subtotal.toFixed(2)}</span></p>
            <p>Envío: $<span id="shipping">${envioCosto.toFixed(2)}</span></p>
            <p class="total">Total: $<span id="total">${total.toFixed(2)}</span></p>
            <div class="cart-buttons">
                <button id="btnClearCart" class="btnSecondary">Vaciar Carrito</button>
                <button id="btnCheckout" class="btnPrimary">Proceder al Pago</button>
            </div>
        </div>
    `;
}

// ----------------------------------------------------------------------
// 🌟 FUNCIÓN DE ASIGNACIÓN DE EVENTOS (Solo se llama una vez) 🌟
// ----------------------------------------------------------------------

function setupEventListeners(): void {
    const cartContainerElement = document.getElementById('cartContainer');
    const totalContainerElement = document.getElementById('totalContainer');

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
                }
                // Opcional: Validar stock aquí si lo consultas al back-end
                // const response = await fetch(`/api/productos/${productId}`);
                // if (response.ok) {
                //     const product = await response.json();
                //     if (newCantidad > product.stock) newCantidad = product.stock;
                // }

                updateItemCantidad(productId, newCantidad);
                renderCart(); // Vuelve a renderizar ítems y totales
            }

            if (target.classList.contains('btn-remove')) {
                removeItem(productId);
                renderCart(); // Vuelve a renderizar ítems y totales
            }
        });
    }

    // --- Eventos de Botones Superiores (Delegación en #totalContainer) ---
    // Usamos delegación porque renderTotals() reemplaza estos botones cada vez.
    if (totalContainerElement) {
        totalContainerElement.addEventListener('click', async(e) => {
            const target = e.target as HTMLElement;

            // Botón "Vaciar Carrito"
            if (target.id === 'btnClearCart') {
                const confirmado = await modalCancelarPedido('¿Estas seguro que quieres vaciar el carrito?')
                    if (!confirmado) {
                        return; // Salir si el usuario no confirma
                    }
                    clearCart();
                    renderCart(); // Actualiza ítems y totales
                
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
                if (cartActual.items.length === 0) {
                    alert('El carrito esta vacío. No se puede confirmar el pedido.');
                    return;
                }

                // Verificacion del Stock antes de enviar al backend
                const validaciones = await Promise.all(cartActual.items.map(async (item) => {
                    const response = await fetch(`${API_URL}/producto/buscarId/${item.idProducto}`);
                    if (!response.ok) {
                        console.error(`Error al verificar stock del producto ${item.idProducto}: ${response.status}`);
                        return { productoId: item.idProducto, ok: false, error: 'Error al verificar producto' };
                    }
                    const product = await response.json();
                    return {
                        productoId: item.idProducto,
                        nombre: item.nombre,
                        okStock: item.cantidad <= product.stock, // verifica el stock
                        stock: product.stock,
                        solicitado: item.cantidad
                    };
                }));

                const varValidaciones = validaciones.find(v => !v.okStock);

                if (varValidaciones) {
                    // 1. Construir el mensaje de error
                    const errorMessage = `No hay suficiente stock para "${varValidaciones.nombre}". Solo hay ${varValidaciones.stock} unidades disponibles, pero solicitaste ${varValidaciones.solicitado}.`;
                    
                    // 2. 🌟 Usar await para mostrar el modal y esperar el clic en "Aceptar"
                    await showStockModal(errorMessage);

                    // 3. Salir de la función (el proceso de pedido se detiene)
                    return;
                }

                function showStockModal(message: string): Promise<void> {
                return new Promise((resolve) => {
                    const modal = document.getElementById('stockModal') as HTMLElement;
                    const messageHeader = document.getElementById('faltante-stock') as HTMLHeadingElement;
                    const aceptarButton = document.getElementById('aceptar') as HTMLButtonElement;

                    if (!modal || !messageHeader || !aceptarButton) {
                        console.error("Faltan elementos del modal de stock.");
                        resolve();
                        return;
                    }

                    // 1. Insertar el mensaje de error
                    messageHeader.textContent = message;

                    // 2. Mostrar el modal (usando flex para centrar)
                    modal.style.display = 'flex'; 

                    // 3. Manejar el clic en "Aceptar"
                    const onAceptarClick = () => {
                        modal.style.display = 'none'; // Ocultar
                        aceptarButton.removeEventListener('click', onAceptarClick);
                        resolve(); // Resolver la promesa
                    };

                    // 4. Asociar evento
                    aceptarButton.addEventListener('click', onAceptarClick);
                });
            }

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
                    total: calcularTotal(envioCosto) // Usar la función de utils
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