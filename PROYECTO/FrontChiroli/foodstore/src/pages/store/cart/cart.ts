import { getCart, updateItemCantidad, removeItem, clearCart, calcularTotal } from "../../../utils/cart";
import { getCurrentUser } from "../../../utils/auth";
import { createOrder } from "../../../utils/api";
import { navigateTo } from "../../../utils/navigate";

const envioCosto = 500;

document.addEventListener('DOMContentLoaded', () =>{
    renderCart();
});

function renderCart(): void{
    const cart = getCart();

    const container = document.getElementById('cartContainer');
    if (!container) {
        console.error("No se encontró el contenedor '#cartContainer' en el HTML.");
        return; // Salimos de la función para evitar errores
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
        // Ocultar resumen y botones si no hay ítems (si los elementos existen)
        const summaryElement = document.querySelector('.cart-summary');
        if (summaryElement) summaryElement.classList.add('hidden');
        const buttonsElement = document.querySelector('.cart-buttons');
        if (buttonsElement) buttonsElement.classList.add('hidden');
        return;
    } else {
        // Mostrar resumen y botones si hay ítems (si los elementos existen)
        const summaryElement = document.querySelector('.cart-summary');
        if (summaryElement) summaryElement.classList.remove('hidden');
        const buttonsElement = document.querySelector('.cart-buttons');
        if (buttonsElement) buttonsElement.classList.remove('hidden');
    }

    // 4. Calcular valores para mostrar
    let subtotal = 0;
    let itemsHtml = '';

    for (const item of cart.items) {
        const itemTotal = item.precio * item.cantidad;
        subtotal += itemTotal;

        // Generar HTML para cada ítem del carrito
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

    const total = calcularTotal(envioCosto); // Utiliza la función de utils

    // 5. Insertar el HTML generado en el contenedor
    container.innerHTML = `
        <div class="cart-items">
            ${itemsHtml}
        </div>
        <div class="cart-summary">
            <h3>Resumen del Pedido</h3>
            <p>Subtotal: <span id="subtotal">$${subtotal.toFixed(2)}</span></p>
            <p>Envío: <span id="shipping">$${envioCosto.toFixed(2)}</span></p>
            <p class="total">Total: <span id="total">$${total.toFixed(2)}</span></p>
            <div class="cart-buttons">
                <button id="btnClearCart" class="btnPrimary">Vaciar Carrito</button>
                <button id="btnCheckout">Proceder al Pago</button>
            </div>
        </div>
    `;

    // 6. Actualizar el resumen del pedido (ahora que los elementos span existen en el DOM)
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toFixed(2);
    } else {
        console.warn("No se encontró el elemento '#subtotal' para actualizar el subtotal.");
    }

    const shippingElement = document.getElementById('shipping');
    if (shippingElement) {
        shippingElement.textContent = envioCosto.toFixed(2);
    } else {
        console.warn("No se encontró el elemento '#shipping' para actualizar el envío.");
    }

    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    } else {
        console.warn("No se encontró el elemento '#total' para actualizar el total.");
    }

    // 7. --- Eventos de Interacción (Usando Event Delegation) ---
    const cartContainerElement = container; // El contenedor principal ya lo tenemos y sabemos que no es null
    if (!cartContainerElement) return; // Esta verificación es redundante ahora, pero por si acaso.

    // Manejar clicks en botones de cantidad (+/-) y eliminar
    cartContainerElement.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const itemDiv = target.closest('.cart-item'); // Encuentra el contenedor del ítem
        if (!itemDiv) return;

        const productId = Number(itemDiv.getAttribute('data-product-id'));
        if (isNaN(productId)) return; // Verificación de seguridad

        // --- A. Botones de Cantidad ---
        if (target.classList.contains('qty-btn')) {
            const action = target.dataset.action;
            if (action !== 'inc' && action !== 'dec') return; // Verificación de seguridad

            const qtyValueSpan = itemDiv.querySelector('.qty-value') as HTMLSpanElement;
            if (!qtyValueSpan) return;
            let currentQty = parseInt(qtyValueSpan.textContent || '0', 10);

            // Calcular nueva cantidad
            let newCantidad = currentQty + (action === 'inc' ? 1 : -1);

            // Validaciones básicas de cantidad
            if (newCantidad < 1) newCantidad = 1;

            // Actualizar cantidad en localStorage y volver a renderizar
            updateItemCantidad(productId, newCantidad);
            renderCart(); // Vuelve a renderizar para reflejar el cambio y recalcular totales
        }

        // --- B. Botón Eliminar ---
        if (target.classList.contains('btn-remove')) {
            // Eliminar ítem de localStorage y volver a renderizar
            removeItem(productId);
            renderCart(); // Vuelve a renderizar para reflejar el cambio y recalcular totales
        }
    });

    // --- Eventos de Botones Superiores ---
    // Botón "Vaciar Carrito"
    const btnClearCart = document.getElementById('btnClearCart');
    if (btnClearCart) {
        btnClearCart.addEventListener('click', () => {
            if (confirm('¿Estás seguro de vaciar el carrito?')) {
                clearCart(); // Limpia localStorage
                renderCart(); // Actualiza la vista
            }
        });
    } else {
        console.warn("No se encontró el botón '#btnClearCart'.");
    }

    // Botón "Proceder al Pago" - Abre el modal
    const btnCheckout = document.getElementById('btnCheckout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            // Releemos el carrito por si acaso ha cambiado desde el renderizado
            const cartActual = getCart();
            if (cartActual.items.length === 0) {
                alert('El carrito está vacío');
                return;
            }
            const modal = document.getElementById('checkoutModal');
            if (modal) {
                 modal.style.display = 'block'; // Mostrar modal
            } else {
                console.error("No se encontró el modal '#checkoutModal'.");
            }
        });
    } else {
        console.warn("No se encontró el botón '#btnCheckout'.");
    }

    // Botón "Cancelar" del Modal
    const btnCancelCheckout = document.getElementById('btnCancelCheckout');
    if (btnCancelCheckout) {
        btnCancelCheckout.addEventListener('click', () => {
            const modal = document.getElementById('checkoutModal');
            if (modal) {
                modal.style.display = 'none'; // Ocultar modal
            }
        });
    } else {
        console.warn("No se encontró el botón '#btnCancelCheckout'.");
    }

    // --- Evento del Formulario de Checkout ---
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar recarga de página por defecto

            try {
                // 1. Obtener datos del formulario
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

                // 2. Validaciones de campos requeridos
                if (!phone || !address || !paymentMethod) {
                    alert('Por favor completa todos los campos obligatorios (teléfono, dirección, método de pago).');
                    return;
                }

                // 3. Obtener usuario actual de localStorage
                const user = getCurrentUser();
                if (!user) {
                    alert('Sesión expirada. Por favor, inicia sesión.');
                    // Opcional: Redirigir al login
                    navigateTo('/src/pages/auth/login/login.html');
                    return;
                }

                // 4. Preparar datos del pedido para enviar al back-end
                const cartActual = getCart(); // Leer carrito actualizado de localStorage
                // Asegúrate de que ICreateOrder coincida con esta estructura
                const orderData = {

                    idUser: user.id, // El ID del usuario autenticado
                    phone,          // Campo requerido del formulario
                    address,        // Campo requerido del formulario
                    paymentMethod,  // Campo requerido del formulario
                    notes: notes || undefined, // Campo opcional del formulario
                    // La lista de items del carrito local -> DetallePedido
                    items: cartActual.items.map(item => ({
                        idProducto: item.idProducto, // ID del producto del carrito local
                        cantidad: item.cantidad      // Cantidad del producto del carrito local
                    })),
                    total: calcularTotal(envioCosto) // Total calculado localmente
                };

                // 5. Enviar pedido al back-end
                const response = await createOrder(orderData);

                if (response.ok) {
                    // 6. Éxito: Limpiar carrito local y redirigir
                    clearCart(); // Limpia el carrito de localStorage
                    navigateTo('/src/pages/client/orders/orders.html'); // Ir a "Mis Pedidos"
                } else {
                    // 7. Error del back-end
                    const errorText = await response.text(); // Obtener mensaje de error
                    throw new Error(errorText || `Error ${response.status} al crear el pedido`);
                }
            } catch (error) {
                // 8. Capturar y mostrar cualquier error
                console.error("Error al confirmar el pedido:", error);
                alert('Error al confirmar el pedido: ' + (error as Error).message);
                // Opcional: Cerrar el modal si ocurrió un error
                const modal = document.getElementById('checkoutModal');
                if (modal) modal.style.display = 'none';
            }
        });
    } else {
        console.warn("No se encontró el formulario '#checkoutForm'.");
    }
}
