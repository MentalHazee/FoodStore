import { getCurrentUser } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";
import { getOrderById, cancelarPedido } from "../../../utils/api";
import type { IOrder } from "../../../types/IOrders";
import { modalCancelarPedido } from "../../../utils/order";


document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificar sesión
    const user = getCurrentUser();
    if (!user) {
        alert('Sesión expirada. Por favor, inicia sesión.');
        navigateTo('/src/pages/auth/login/login.html');
        return;
    }

    // Mostrar nombre de usuario en el navbar
    const userNameDisplay = document.getElementById('userNameHeader');
    if (userNameDisplay) {
        userNameDisplay.textContent = user.nombre || user.mail;
    }

    /* Opcional: Añadir evento de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
            navigateTo('/src/pages/auth/login/login.html');
        });
    }*/

    try {
        // 2. Cargar pedidos del usuario desde el back-end
        // Asumiendo que fetchOrdersByUserId llama a GET /api/pedidos?userId=${user.id} o similar
        const orders: IOrder[] = await getOrderById(user.id);

        // 3. Renderizar pedidos (o estado vacío)
        renderOrders(orders);

    } catch (error) {
        console.error("Error al cargar los pedidos:", error);
        const container = document.getElementById('ordersContainer');
        if (container) {
            container.innerHTML = `<p class="error">Error al cargar los pedidos: ${(error as Error).message}</p>`;
        }
    }
});

// --- Función Principal: renderOrders ---
/**
 * Renderiza la lista de pedidos en tarjetas dentro del contenedor '#ordersContainer'.
 * Si la lista está vacía, muestra un mensaje de estado vacío.
 * @param orders - Array de objetos IOrder a renderizar.
 */
function renderOrders(orders: IOrder[]): void {
    const container = document.getElementById('ordersContainer');
    if (!container) {
        console.error("No se encontró el contenedor '#ordersContainer'.");
        return;
    }

    if (orders.length === 0) {
        // Mostrar estado vacío
        container.innerHTML = `
            <div class="empty-orders">
                <h2>No tienes pedidos aún</h2>
                <p>¡Realiza tu primera compra!</p>
                <button onclick="location.href='/src/pages/store/home/home.html'">Ir a la tienda</button>
            </div>
        `;
        return;
    }

    // Ordenar pedidos por fecha (más reciente primero)
    const sortedOrders = orders.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    // Generar HTML para cada pedido
    const ordersHtml = sortedOrders.map(order => {
        // Resumen de productos: primeros 3 + contador si hay más
        const productosResumen = order.items.slice(0, 3).map(item => item.nombre).join(', ');
        const productosExtra = order.items.length > 3 ? `... +${order.items.length - 3}` : '';

        const puedeCancelar = order.estado === 'PENDIENTE'; // Solo si está pendiente

        // Botón de cancelar condicional
        const botonCancelarHtml = puedeCancelar
            ? `<button class="btn-cancelar" data-order-id="${order.id}">Cancelar Pedido</button>`
            : ''; // Si no se puede cancelar, no se renderiza el botón

        return `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <p><strong>Pedido #${order.id}</strong></p>
                    <p class="order-date">${new Date(order.fecha).toLocaleString()}</p>
                </div>
                <p>Estado: <span class="badge ${getStatusClass(order.estado)}">${getStatusText(order.estado)}</span></p>
                <p>Productos: ${productosResumen} ${productosExtra}</p>
                <p class="order-total">Total: $${order.total.toFixed(2)}</p><br>
                <button class="btn-detail">Ver detalle</button>
                ${botonCancelarHtml}
            </div>
        `;
    }).join('');

    container.innerHTML = ordersHtml;

    // Añadir evento click a los botones de detalle
    document.querySelectorAll('.btn-detail').forEach(button => {
    button.addEventListener('click', (e) => {
        // Verificamos si e.currentTarget es un Element (necesario para usar .closest)
        if (!(e.currentTarget instanceof Element)) {
            console.error("e.currentTarget no es un Element, no se puede usar .closest().");
            return;
        }

        // Ahora TypeScript sabe que e.currentTarget es un Element
        const clickedElement = e.currentTarget;

        // Buscamos el .order-card ancestro del elemento clickeado (que debería ser el botón)
        const orderCard = clickedElement.closest('.order-card');

        // Verificamos si encontramos el .order-card
        if (!orderCard) {
            console.error("No se encontró el contenedor '.order-card' para este botón.");
            return;
        }

        // Obtenemos el ID del pedido del atributo data-order-id del contenedor .order-card
        const orderIdStr = orderCard.getAttribute('data-order-id');
        if (!orderIdStr) {
            console.error("El contenedor '.order-card' no tiene el atributo 'data-order-id'.");
            return;
        }

        // Convertimos el ID a número
        const orderId = Number(orderIdStr);
        // Verificamos que la conversión haya sido exitosa
        if (isNaN(orderId)) {
            console.error(`El ID del pedido '${orderIdStr}' no es un número válido.`);
            return;
        }

        // Buscar el pedido completo en la lista para pasarlo al modal
        const orderToDetail = orders.find(o => o.id === orderId);
        if (orderToDetail) {
            showOrderDetail(orderToDetail);
        } else {
            console.error(`Pedido con ID ${orderId} no encontrado en la lista local.`);
        }
    });
});
    //evento de boton cancelar
    document.querySelectorAll('.btn-cancelar').forEach(button => {
        button.addEventListener('click', async (e) => {
            if (!(e.currentTarget instanceof Element)) {
                console.error("e.currentTarget no es un Element.");
                return;
            }
            const clickedButton = e.currentTarget;
            const orderId = Number(clickedButton.getAttribute('data-order-id'));
            if (isNaN(orderId)) {
                console.error("ID de pedido no válido para cancelar.");
                return;
            }

            // Confirmar la cancelación
            const confirmado = await modalCancelarPedido('¿Estas seguro que quiere cancelar el pedido?')
            if (!confirmado) {
                return; // Salir si el usuario no confirma
            }

            const orderToCancel = orders.find(o => o.id === orderId);
            if (!orderToCancel) {
                console.error(`Pedido con ID ${orderId} no encontrado en la lista local para cancelar.`);
                alert("Error: Pedido no encontrado.");
                return;
            }

            const itemsParaDevolver = orderToCancel.items.map(items => ({
                idProducto: items.idProducto,
                cantidad: items.cantidad      
            }));

            try {
                // Llamar a la función para cancelar el pedido en el back-end
                const response = await cancelarPedido(orderId, itemsParaDevolver);

                if (response.ok) {
                    // Cancelación exitosa
                    /*alert(`El pedido #${orderId} ha sido cancelado.`);*/
                    const pedidoIndex = orders.findIndex(o => o.id === orderId);
                    if (pedidoIndex !== -1) {

                        orders[pedidoIndex].estado = 'CANCELADO'; // Actualizar estado local
                        renderOrders(orders); // Volver a renderizar con la lista actualizada
                    } else {
                        // Si no se encuentra localmente, recargar desde el back-end
                        const user = getCurrentUser();
                        if (user) {
                            const ordersActualizados = await getOrderById(user.id);
                            renderOrders(ordersActualizados);
                        }
                    }
                } else {
                    // Error del back-end
                    const errorText = await response.text();
                    throw new Error(errorText || `Error ${response.status} al cancelar el pedido.`);
                }
            } catch (error) {
                console.error("Error al cancelar el pedido:", error);
                alert('Error al cancelar el pedido: ' + (error as Error).message);
            }
        });
    });
}


/**
 * Muestra el detalle de un pedido específico en un modal.
 * @param order - El objeto IOrder a mostrar en el modal.
 */
function showOrderDetail(order: IOrder): void {
    const modal = document.getElementById('orderDetailModal');
    const content = document.getElementById('orderDetailContent');
    if (!modal || !content) {
        console.error("No se encontró el modal '#orderDetailModal' o su contenido '#orderDetailContent'.");
        return;
    }

    // Calcular subtotal (asumiendo que el total incluye envío, si no, el back-end debería enviar subtotal también)
    // const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0); // Si subtotal está en IOrderItem

    const subtotal = order.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = 500; // Asumiendo total = subtotal + envío

    // Generar HTML para la lista de ítems del pedido
    const itemsHtml = order.items.map(item => `
        <div class="order-item">
            <div class="item-details">
                <h4>${item.nombre}</h4>
                <p>Cantidad: ${item.cantidad}</p>
                <p>Precio Unitario: $${item.precio.toFixed(2)}</p>
                <p>Subtotal: $${item.subtotal.toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    // Llenar el contenido del modal
    content.innerHTML = `
        <h2>Detalle del Pedido #${order.id}</h2>
        <p class="status-detail ${getStatusClass(order.estado)}">
            <span class="status-icon">${getStatusIcon(order.estado)}</span>
            ${getStatusText(order.estado)}
        </p>
        <div class="order-info">
            <h3>Información de Entrega</h3>
            <p><strong>Nombre:</strong> ${order.nombre}</p>
            <p><strong>Teléfono:</strong> ${order.phone}</p>
            <p><strong>Dirección:</strong> ${order.address}</p>
            <p><strong>Método de Pago:</strong> ${getPaymentMethodText(order.paymentMethod)}</p>
            ${order.notes ? `<p><strong>Notas:</strong> ${order.notes}</p>` : ''}
        </div>
        <div class="order-items">
            <h3>Productos</h3>
            ${itemsHtml}
        </div>
        <div class="order-summary">
            <h3>Resumen</h3>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Envío: $${envio.toFixed(2)}</p>
            <p class="total">Total: $${subtotal + envio}</p>
        </div>
        <div class="status-message">
            ${getStatusMessage(order.estado)}
        </div>
    `;

    // Mostrar el modal
    modal.style.display = 'block';
}

// --- Funciones auxiliares para estados, badges, etc. ---
function getStatusText(status: string): string {
  const map: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'En Preparación',
    COMPLETADO: 'Entregado',
    CANCELADO: 'Cancelado'
  };
  return map[status] || status;
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    PENDIENTE: 'pending',
    CONFIRMADO: 'processing',
    COMPLETADO: 'completed',
    CANCELADO: 'cancelled'
  };
  return map[status] || 'default';
}

function getStatusIcon(status: string): string {
  const map: Record<string, string> = {
    PENDIENTE: '⏳',
    CONFIRMADO: ' 󰞽', //usar un ícono de fuente o SVG
    COMPLETADO: '✅',
    CANCELADO: '❌'
  };
  return map[status] || '❓';
}

function getPaymentMethodText(method: string): string {
  const map: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia'
  };
  return map[method] || method;
}

function getStatusMessage(status: string): string {
  const map: Record<string, string> = {
    PENDIENTE: 'Tu pedido ha sido recibido y está siendo procesado.',
    CONFIRMADO: 'Tu pedido está en preparación.',
    COMPLETADO: 'Tu pedido ha sido entregado. ¡Gracias por tu compra!',
    CANCELADO: 'Tu pedido ha sido cancelado.'
  };
  return map[status] || '';
}

// --- Eventos para cerrar el modal ---
document.getElementById('closeModal')?.addEventListener('click', () => {
  const modal = document.getElementById('orderDetailModal');
  if (modal) modal.style.display = 'none';
});

// Cerrar al hacer clic fuera del contenido del modal
window.addEventListener('click', (e) => {
  const modal = document.getElementById('orderDetailModal');
  if (e.target === modal) {
    if (modal) modal.style.display = 'none';
  }
});