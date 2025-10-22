// ============================================
// FUNCIONES DE UI
// ============================================

import { createDni, deleteDni, getAllDnis, getDniById, updateDni } from "./services/api";
import type { DniCreate, DniDto, DniEdit } from "./types/IDni";
import { getElementById } from "./utlis/getElementById";

const showLoading = (show: boolean): void => {
  const loading = getElementById("loading");
  if (loading) {
    loading.classList.toggle("hidden", !show);
  }
};

const showMessage = (message: string, type: "success" | "error"): void => {
  const messageEl = getElementById("message");
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;

    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      messageEl.classList.add("hidden");
    }, 3000);
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const createDniCard = (dni: DniDto): HTMLElement => {
  const card = document.createElement("div");
  card.className = "dni-card";

  card.innerHTML = `
        <img src="${dni.foto.url}" alt="${
    dni.foto.nombre
  }" onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
        <div class="dni-info">
            <p><strong>ID:</strong> <span>${dni.id}</span></p>
            <p><strong>Nombre:</strong> <span>${dni.nombre}</span></p>
            <p><strong>Número:</strong> <span>${dni.numero}</span></p>
            <p><strong>Creación:</strong> <span>${formatDate(
              dni.fechaCreacion
            )}</span></p>
            <p><strong>Vencimiento:</strong> <span>${formatDate(
              dni.fechaVencimiento
            )}</span></p>
        </div>
        <div class="dni-actions">
            <button class="btn btn-view" data-id="${
              dni.id
            }">👁️ Ver Detalle</button>
        </div>
    `;

  // Agregar evento al botón de ver detalle
  const viewBtn = card.querySelector(".btn-view") as HTMLButtonElement;
  viewBtn.addEventListener("click", () => openModal(dni.id));

  return card;
};

const renderDniList = async (): Promise<void> => {
  const listContainer = getElementById("dniList");
  if (!listContainer) return;

  try {
    showLoading(true);
    const dnis = await getAllDnis();

    listContainer.innerHTML = "";

    if (dnis.length === 0) {
      listContainer.innerHTML =
        '<p style="text-align: center; color: var(--text-secondary);">No hay DNIs registrados</p>';
      return;
    }

    dnis.forEach((dni) => {
      const card = createDniCard(dni);
      listContainer.appendChild(card);
    });
  } catch (error) {
    showMessage("Error al cargar la lista de DNIs", "error");
    listContainer.innerHTML =
      '<p style="text-align: center; color: var(--error-color);">Error al cargar los datos</p>';
  } finally {
    showLoading(false);
  }
};

const handleFormSubmit = async (event: Event): Promise<void> => {
  event.preventDefault();

  // Obtener los valores del formulario
  const nombre = (getElementById("nombre") as HTMLInputElement).value;
  const numero = parseInt(
    (getElementById("numero") as HTMLInputElement).value
  );
  const fechaVencimiento = (
    getElementById("fechaVencimiento") as HTMLInputElement
  ).value;
  const fotoNombre = (getElementById("fotoNombre") as HTMLInputElement)
    .value;
  const fotoUrl = (getElementById("fotoUrl") as HTMLInputElement)
    .value;

  // Crear el objeto DniCreate siguiendo la estructura de tu backend
  const dniData: DniCreate = {
    nombre,
    numero,
    fechaVencimiento,
    foto: {
      nombre: fotoNombre,
      url: fotoUrl,
    },
  };

  try {
    showLoading(true);

    // Llamar a la API
    const newDni = await createDni(dniData);

    showMessage(`DNI creado exitosamente con ID: ${newDni.id}`, "success");

    // Limpiar el formulario
    (event.target as HTMLFormElement).reset();

    // Actualizar la lista
    await renderDniList();
  } catch (error) {
    showMessage("Error al crear el DNI. Verifica los datos.", "error");
  } finally {
    showLoading(false);
  }
};

// ============================================
// FUNCIONES DEL MODAL
// ============================================

let currentDni: DniDto | null = null;

const openModal = async (id: number): Promise<void> => {
  try {
    showLoading(true);
    currentDni = await getDniById(id);

    // Mostrar el modal
    const modalOverlay = getElementById("modalOverlay");
    if (modalOverlay) {
      modalOverlay.classList.remove("hidden");
    }

    // Llenar los datos en modo vista
    showViewMode();
  } catch (error) {
    showMessage("Error al cargar el DNI", "error");
  } finally {
    showLoading(false);
  }
};

const closeModal = (): void => {
  const modalOverlay = getElementById("modalOverlay");
  if (modalOverlay) {
    modalOverlay.classList.add("hidden");
  }
  currentDni = null;
};

const showViewMode = (): void => {
  if (!currentDni) return;

  // Mostrar modo vista, ocultar modo edición
  const viewMode = getElementById("viewMode");
  const editMode = getElementById("editMode");
  if (viewMode) viewMode.classList.remove("hidden");
  if (editMode) editMode.classList.add("hidden");

  // Llenar datos
  const elements = {
    viewId: currentDni.id.toString(),
    viewNombre: currentDni.nombre,
    viewNumero: currentDni.numero.toString(),
    viewCreacion: formatDate(currentDni.fechaCreacion),
    viewVencimiento: formatDate(currentDni.fechaVencimiento),
    viewFotoNombre: currentDni.foto.nombre,
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = getElementById(id);
    if (element) element.textContent = value;
  });

  const fotoImg = getElementById("viewFoto") as HTMLImageElement;
  if (fotoImg) fotoImg.src = currentDni.foto.url;
};

const showEditMode = (): void => {
  if (!currentDni) return;

  // Ocultar modo vista, mostrar modo edición
  const viewMode = getElementById("viewMode");
  const editMode = getElementById("editMode");
  if (viewMode) viewMode.classList.add("hidden");
  if (editMode) editMode.classList.remove("hidden");

  // Llenar formulario de edición
  (getElementById("editId") as HTMLInputElement).value =
    currentDni.id.toString();
  (getElementById("editNombre") as HTMLInputElement).value =
    currentDni.nombre;
  (getElementById("editNumero") as HTMLInputElement).value =
    currentDni.numero.toString();
  (getElementById("editFechaVencimiento") as HTMLInputElement).value =
    currentDni.fechaVencimiento;
  (getElementById("editFotoNombre") as HTMLInputElement).value =
    currentDni.foto.nombre;
  (getElementById("editFotoUrl") as HTMLInputElement).value =
    currentDni.foto.url;
};

const handleEditSubmit = async (event: Event): Promise<void> => {
  event.preventDefault();

  if (!currentDni) return;

  const id = currentDni.id;
  const nombre = (getElementById("editNombre") as HTMLInputElement)
    .value;
  const numero = parseInt(
    (getElementById("editNumero") as HTMLInputElement).value
  );
  const fechaVencimiento = (
    getElementById("editFechaVencimiento") as HTMLInputElement
  ).value;
  const fotoNombre = (
    getElementById("editFotoNombre") as HTMLInputElement
  ).value;
  const fotoUrl = (getElementById("editFotoUrl") as HTMLInputElement)
    .value;

  const dniEdit: DniEdit = {
    nombre,
    numero,
    fechaVencimiento,
    foto: {
      nombre: fotoNombre,
      url: fotoUrl,
    },
  };

  try {
    showLoading(true);
    const updatedDni = await updateDni(id, dniEdit);

    showMessage("DNI actualizado exitosamente", "success");
    currentDni = updatedDni;
    showViewMode();
    await renderDniList();
  } catch (error) {
    showMessage("Error al actualizar el DNI", "error");
  } finally {
    showLoading(false);
  }
};

const handleDelete = async (): Promise<void> => {
  if (!currentDni) return;

  const confirmed = confirm(
    `¿Está seguro que desea eliminar el DNI de ${currentDni.nombre}?`
  );

  if (!confirmed) return;

  try {
    showLoading(true);
    await deleteDni(currentDni.id);

    showMessage("DNI eliminado exitosamente", "success");
    closeModal();
    await renderDniList();
  } catch (error) {
    showMessage("Error al eliminar el DNI", "error");
  } finally {
    showLoading(false);
  }
};

// ============================================
// INICIALIZACIÓN
// ============================================

const init = (): void => {
  // Event Listeners del formulario de crear
  const form = getElementById("dniForm");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  const refreshBtn = getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => renderDniList());
  }

  // Event Listeners del modal
  const closeModalBtn = getElementById("closeModal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  const modalOverlay = getElementById("modalOverlay");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  const editBtn = getElementById("editBtn");
  if (editBtn) {
    editBtn.addEventListener("click", showEditMode);
  }

  const cancelEditBtn = getElementById("cancelEditBtn");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", showViewMode);
  }

  const deleteBtn = getElementById("deleteBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDelete);
  }

  const editForm = getElementById("editForm");
  if (editForm) {
    editForm.addEventListener("submit", handleEditSubmit);
  }

  // Cargar la lista inicial
  renderDniList();
};

// Esperar a que el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
