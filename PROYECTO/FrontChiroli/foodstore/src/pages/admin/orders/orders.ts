
import { getCurrentUser} from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";
import { getAllOrders, updateStatus, cancelarPedido, getOrderById } from "../../../utils/api";
import type { IOrder } from "../../../types/IOrders";
import { modalCancelarPedido } from "../../../utils/order";

//const API_URL = 'http://localhost:8080';

let currentStatus: string | null = null;
let allOrders: IOrder[];

document.addEventListener('DOMContentLoaded', async () => {
  const user = getCurrentUser();
  if (!user || user.rol !== 'ADMIN') {
    alert('Acceso denegado. Debes ser administrador.');
    navigateTo('/src/pages/auth/login/login.html');
    return;
  }
  const userNameElement = document.getElementById('userNameHeader');
  if (userNameElement) {
    userNameElement.textContent = user.nombre || user.mail; // Ajusta 'email' o 'mail' según tu IUsers
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
    const puedeCancelar = order.estado === 'PENDIENTE';
    const botonCancelarHtml = puedeCancelar
      ? `<button class="btn-cancelar" data-order-id="${order.id}">Cancelar Pedido</button>` // Añadido texto para distinguir
          : ''; // Si no se puede cancelar, no se renderiza el botón

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
        ${botonCancelarHtml}<!-- Se inserta el botón aquí -->
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

  document.querySelectorAll('.btn-cancelar').forEach(button =>{
    button.addEventListener('click', async (e) =>{
      if (!(e.currentTarget instanceof Element)){
        console.error("e.currentTarget no es un Element.");
        return;
      }
      const clikedButton = e.currentTarget;
      const orderId = Number(clikedButton.getAttribute('data-order-id'));
      if(isNaN(orderId)){
        console.error("ID de pedido no válido para cancelar.");
        return;
      }
      // Confirmar la cancelación
      const confirmado = await modalCancelarPedido(`¿Estás seguro de que deseas cancelar el pedido?`);
      if (!confirmado) {
      return; // Salir si el usuario no confirma
      }
      // Buscar el pedido en la LISTA LOCAL 'orders' que se pasó a renderOrders
      const orderToCancel = orders.find(o => o.id === orderId);
      if (!orderToCancel) {
        console.error(`Pedido con ID ${orderId} no encontrado en la lista local para cancelar.`);
        alert("Error: Pedido no encontrado.");
        return;
      }
      const itemsParaDevolver = orderToCancel.items.map(item => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad
      }));
      
      try{
        // Llamar a la función para cancelar el pedido en el back-end
        // Esta función debería enviar PUT /pedido/cancelar/{id} con { estado: 'cancelled', items: [...] }
        const response = await cancelarPedido(orderId, itemsParaDevolver);

        if (response.ok) {
            // Cancelación exitosa
            modalCancelarPedido(`El pedido #${orderId} ha sido cancelado.`);
            // Actualizar la vista local (opcional, o recargar toda la lista)
            const pedidoIndex = allOrders.findIndex(o => o.id === orderId); // Buscar en la lista GLOBAL 'allOrders'
            if (pedidoIndex !== -1) {
              allOrders[pedidoIndex].estado = 'CANCELADO'; // Actualizar estado local en la lista GLOBAL
              renderOrders(allOrders); // Volver a renderizar la lista GLOBAL con el estado actualizado
            } else {
                // Si no se encuentra en la lista global (improbable si el pedido existía antes), recargar desde el back-end
                // allOrders = await fetchAllOrders(); // <-- Opcional: Recargar todo
                // renderOrders(allOrders);             // <-- Opcional: Volver a renderizar
                // O simplemente recargar la lista actualizada
                const ordersActualizados = await getAllOrders(); // Recarga todos los pedidos
                allOrders = ordersActualizados; // Actualiza la variable global
                renderOrders(allOrders); // Vuelve a renderizar con los datos frescos
              }
          } else {
              // Error del back-end
              const errorText = await response.text();
              throw new Error(errorText || `Error ${response.status} al cancelar el pedido.`);
            }
        } catch (error) {
            console.error("Error al cancelar el pedido:", error);
            alert('Error al cancelar el pedido: ' + (error as Error).message);}
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
  const envio = 500;

  const itemsHtml = order.items.map(item => `
    <div class="order-item">
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
    PENDIENTE: 'PENDIENTE',
    CONFIRMADO: 'CONFIRMADO',
    TERMINADO: 'TERMINADO',
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
        <p><strong>Nombre:</strong> ${order.nombre}</p>
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
        <p class="total">Total: $${subtotal + envio}</p>
    </div>
    <div class="admin-actions">
        <label for="newStatusSelect">Cambiar Estado:</label>
        <select id="newStatusSelect">
            ${statusOptionsHtml}
        </select>
        <button id="updateStatusBtn">Actualizar Estado</button>
        <button id="btn-cancelar">Cancelar Pedido</button>
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
                const errorMessage = `Estado del pedido actualizado correctamente.`;
                    
                    // 2. 🌟 Usar await para mostrar el modal y esperar el clic en "Aceptar"
                await showEstadoModal(errorMessage);
                //alert('Estado del pedido actualizado correctamente.');
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
    CONFIRMADO: 'CONFIRMADO',
    TERMINADO: 'TERMINADO',
    CANCELADO: 'CANCELADO',
    // Ajusta según los estados reales de tu back-end
  };
  return map[status] || status;
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    PENDIENTE: 'PENDIENTE',
    CONFIRMADO: 'CONFIRMADO',
    TERMINADO: 'TERMINADO',
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

function showEstadoModal(message: string): Promise<void> {
                return new Promise((resolve) => {
                    const modal = document.getElementById('estadoModal') as HTMLElement;
                    const messageHeader = document.getElementById('cambiar-estado') as HTMLHeadingElement;
                    const aceptarButton = document.getElementById('aceptar') as HTMLButtonElement;

                    if (!modal || !messageHeader || !aceptarButton) {
                        console.error("Faltan elementos del modal.");
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
                })};