
import { getCurrentUser} from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";
import { getAllOrders, updateStatus } from "../../../utils/api";
import type { IOrder } from "../../../types/IOrders";

//const API_URL = 'http://localhost:8080/api';

let currentStatus: string | null = null;
let allOrders: IOrder[];

document.addEventListener('DOMContentLoaded', async () => {
  const user = getCurrentUser();
  if (!user || user.rol !== 'ADMIN') {
    alert('Acceso denegado. Debes ser administrador.');
    navigateTo('/src/pages/auth/login/login.html');
    return;
  }
  try {
    // Cargar TODOS los pedidos
    allOrders = await getAllOrders();
    renderOrders(allOrders);

    // Agregar evento al filtro de estado
    const statusFilter = document.getElementById('statusFilter') as HTMLSelectElement;
    if (statusFilter) { // Verificar si el elemento existe
        statusFilter.addEventListener('change', (e) => {
          const selectedStatus = (e.target as HTMLSelectElement).value || null;
          currentStatus = selectedStatus;
          applyFilters();
        });
    } else {
        console.error("No se encontró el elemento '#statusFilter'.");
    }

  } catch (error) {
    console.error("Error al cargar los pedidos:", error);
    const container = document.getElementById('ordersContainer');
    if (container) {
      container.innerHTML = `<p class="error">Error al cargar los pedidos: ${(error as Error).message}</p>`;
    }
  }
});

function applyFilters(): void {
  let filteredOrders = allOrders;

  if (currentStatus) {
    filteredOrders = filteredOrders.filter(order => order.estado === currentStatus);
  }

  renderOrders(filteredOrders);
}

function renderOrders(orders: IOrder[]): void {
  const container = document.getElementById('ordersContainer');
  if (!container) {
      console.error("No se encontró el contenedor '#ordersContainer'.");
      return;
  }

  if (orders.length === 0) {
    container.innerHTML = `<p class="no-orders">No hay pedidos ${currentStatus ? `con estado "${getStatusText(currentStatus)}"` : ''}.</p>`;
    return;
  }


 // Ordenar por fecha (más reciente primero)
  const sortedOrders = orders.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const ordersHtml = sortedOrders.map(order => {
    const nombreCliente = order.id || `Usuario ${order.nombre}`; // Ajusta según lo que devuelva el back-end

    return `
      <div class="order-card" data-order-id="${order.id}">
        <div class="order-header">
            <p><strong>Pedido #${order.id}</strong></p>
            <p class="order-client">${nombreCliente}</p> <!-- Mostrar nombre o id del cliente -->
            <p class="order-date">${new Date(order.fecha).toLocaleString()}</p>
        </div>
        <p>Estado: <span class="badge ${getStatusClass(order.estado)}">${getStatusText(order.estado)}</span></p>
        <p>Productos: ${order.items.length}</p>
        <p class="order-total">Total: $${order.total.toFixed(2)}</p>
        <button class="btn-detail">Ver detalle</button>
      </div>    
    `;
  }).join('');

  container.innerHTML = ordersHtml;

   // Agregar evento click a los botones de detalle
  document.querySelectorAll('.btn-detail').forEach(button => {
    button.addEventListener('click', (e) => {
      const orderCard = (e.currentTarget as HTMLElement).closest('.order-card');
      if(!orderCard){
        console.error("No se encontro el contenedor .order-card para este botón.");
        return;
      }
      const orderId = Number(orderCard.getAttribute('data-order-id'));
      if (orderId) {
        showOrderDetail(orderId, allOrders); // Pasamos la lista completa para buscar el pedido
      } else{
        console.warn("El atributo data-order-id no es válido o no existe.")
      }
    });
  });
}

function showOrderDetail(orderId: number, allOrders: IOrder[]): void {
  const order = allOrders.find(o => o.id === orderId);
  if (!order) {
    alert('Pedido no encontrado.');
    return;
  }
  const modal = document.getElementById('orderDetailModal');
  const content = document.getElementById('orderDetailContent');
  if (!modal || !content) {
      console.error("No se encontró el modal '#orderDetailModal' o su contenido '#orderDetailContent'.");
      return;
    }
     const subtotal = order.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const envio = order.total - subtotal; // Asumiendo que total = subtotal + envío

  const itemsHtml = order.items.map(item => `
    <div class="order-item">
        <img src="${item.imagenUrl || '/src/assets/default-product.png'}" alt="${item.nombre}" width="50" />
        <div class="item-details">
            <h4>${item.nombre}</h4>
            <p>Cantidad: ${item.cantidad}</p>
            <p>Precio Unitario: $${item.precio.toFixed(2)}</p>
            <p>Subtotal: $${(item.precio * item.cantidad).toFixed(2)}</p>
        </div>
    </div>
  `).join('');

  // Generar opciones para el select de estado
  // Asegúrate de que las claves del objeto coincidan con los estados que maneja tu back-end
  const statusOptionsHtml = Object.keys({
    PPENDIENTE: 'PENDIENTE',
    CONDIRMADO: 'CONFIRMADO',
    COMPLETADO: 'TERMINADO',
    CANCELADO: 'CANCELADO',
    // Añade aquí todos los estados posibles que el admin pueda seleccionar
  }).map(status => `
    <option value="${status}" ${status === order.estado ? 'selected' : ''}>${getStatusText(status)}</option>
  `).join('');

  content.innerHTML = `
    <h2>Detalle del Pedido #${order.id}</h2>
    <div class="order-info">
        <h3>Información del Cliente</h3>
        <p><strong>ID Usuario:</strong> ${order.id}</p>
        <!-- Si el back-end devuelve el nombre del cliente, muéstralo aquí -->
        <!-- <p><strong>Nombre:</strong> ${order.nombre}</p> -->
        <h3>Entrega</h3>
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
        <p class="total">Total: $${order.total.toFixed(2)}</p>
    </div>
    <div class="admin-actions">
        <label for="newStatusSelect">Cambiar Estado:</label>
        <select id="newStatusSelect">
            ${statusOptionsHtml}
        </select>
        <button id="updateStatusBtn">Actualizar Estado</button>
    </div>
  `;

  // Agregar evento al botón de actualizar estado
  const updateStatusBtn = document.getElementById('updateStatusBtn');
  if (updateStatusBtn) {
      updateStatusBtn.addEventListener('click', async () => {
        const newStatusSelect = document.getElementById('newStatusSelect') as HTMLSelectElement;
        if (!newStatusSelect) {
            console.error("No se encontró el select '#newStatusSelect'.");
            return;
        }
        const newStatus = newStatusSelect.value;

        if (newStatus !== order.estado) {
          try {
            // Llamar a la función de API para actualizar el estado
            const response = await updateStatus(order.id, newStatus);

            if (response.ok) {
                // Actualizar la vista local (opcional, o recargar toda la lista)
                // Buscar el pedido en la lista global y actualizar su estado
                const pedidoIndex = allOrders.findIndex(o => o.id === order.id);
                if (pedidoIndex !== -1) {
                    allOrders[pedidoIndex].estado = newStatus as IOrder["estado"];
                }
                // Cerrar modal y refrescar lista
                modal.style.display = 'none';
                applyFilters(); // Aplica filtros y vuelve a renderizar con los datos actualizados localmente (si la API fue exitosa)
                alert('Estado del pedido actualizado correctamente.');
            } else {
                // Si el back-end devuelve un error, lo manejamos aquí
                const errorText = await response.text();
                throw new Error(errorText || `Error ${response.status} al actualizar el estado`);
            }
          } catch (error) {
            alert('Error al actualizar el estado: ' + (error as Error).message);
          }
        } else {
            alert('El estado seleccionado es el mismo que el actual.');
        }
      });
  } else {
      console.error("No se encontró el botón '#updateStatusBtn'.");
  }

  modal.style.display = 'block';
}


function getStatusText(status: string): string {
  const map: Record<string, string> = {
    PENDIENTE: 'PENDIENTE',
    CONDIRMADO: 'CONFIRMADO',
    COMPLETADO: 'TERMINADO',
    CANCELADO: 'CANCELADO',
    // Ajusta según los estados reales de tu back-end
  };
  return map[status] || status;
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    PENDIENTE: 'PENDIENTE',
    CONDIRMADO: 'CONFIRMADO',
    COMPLETADO: 'TERMINADO',
    CANCELADO: 'CANCELADO',
    // Ajusta según los estados reales de tu back-end
  };
  return map[status] || 'default';
}

function getPaymentMethodText(method: string): string {
  const map: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia'
  };
  return map[method] || method;
}

document.getElementById('closeModal')?.addEventListener('click', () => {
  const modal = document.getElementById('orderDetailModal');
  if (modal) modal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
  const modal = document.getElementById('orderDetailModal');
  if (e.target === modal) {
    if (modal) modal.style.display = 'none';
  }
});