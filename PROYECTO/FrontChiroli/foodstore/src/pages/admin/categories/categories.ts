const API_URL = 'http://localhost:8080'; // dirección base del backend (localhost en desarrollo)
import type { ICategoria } from "../../../types/ICategoria";
import { getCategorias } from "../../../utils/api";

//crear nueva categoria (solo admin)
export async function crearCategoria(categoriaData: Omit<ICategoria, 'id'>): Promise<ICategoria>{
    const response = await fetch(`${API_URL}/categoria/crear`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoriaData)
    });
    if (!response.ok) {
        throw new Error('No se pudo crear la categoria');
    }
    return response.json();
}

//actualizar una categoria (solo admin)
export async function actualizarCategoria(id: number, categoriaData: ICategoria): Promise<ICategoria>{
    const response = await fetch(`${API_URL}/categoria/actualizar/${id}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoriaData)
    });
    if (!response.ok) {
        throw new Error('No se pudo actualizar la categoria');
    }
    return response.json();
}

//eliminar una categoria (solo admin)
export async function eliminarCategoria(id: number): Promise<void>{
    const response = await fetch(`${API_URL}/categoria/borrar/${id}`,{
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('No se pudo eliminar la categoria');
    }
}

let categoriasCache: ICategoria[] | null = null;
let editID: number | null = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategorias();
    //configurar en comportamiento del formulario
    setUpFormulario();

    const btnNewCategoria = document.getElementById('btnNewCategoria');
    if (btnNewCategoria){
        btnNewCategoria.addEventListener('click', () => {
            editID = null;
            abrirFormulario();
        });
    }

    // crear el evento para el boton cancelar
    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar){
        btnCancelar.addEventListener('click', cerrarFormulario);
    }
});

//cargar categorias
async function loadCategorias(): Promise<void>{
    try{
        categoriasCache = await getCategorias();
        renderCategorias();
    }catch (error) {
        console.error('Error al cargar las categorias:', error);
        alert('Error al cargar las categorias. Por favor, intente nuevamente más tarde.');
    }
}

//renderizar la tabla de categorias
function renderCategorias(): void {
    const tablaBody = document.querySelector<HTMLTableSectionElement>('#categoriasTable tbody');
    if (!tablaBody) return;

    tablaBody.innerHTML = (categoriasCache ?? []).map(categoria => `
        <tr>
            <td>${categoria.id}</td>
            <td><img src="${categoria.imageUrl}" alt="${categoria.nombre}" width="50" /></td>
            <td>${categoria.nombre}</td>
            <td>${categoria.description}</td>
            <td>
                <!-- Botones con data-id para identificar la categoría -->
                <button class="btn-edit" data-id="${categoria.id}">Editar</button>
                <button class="btn-delete" data-id="${categoria.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');

    // Agregar eventos a los botones de editar y eliminar
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).dataset.id);
            editCategoria(id);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).dataset.id);
            confirmDelete(id); // Preguntar antes de borrar
        });
    });
}

function editCategoria(id: number): void {
    const categoria = categoriasCache?.find(c => c.id === id);
    if (!categoria) return;

    // Rellenar el formulario con los datos de la categoría
    (document.getElementById('name') as HTMLInputElement).value = categoria.nombre;
    (document.getElementById('description') as HTMLTextAreaElement).value = categoria.description;
    (document.getElementById('imageUrl') as HTMLInputElement).value = categoria.imageUrl;

  // Guardamos el ID para saber que estamos editando
    editID = id;
    abrirFormulario();
}

//mostrar el formulario
function abrirFormulario(): void {
    const formularioContainer = document.getElementById('formularioContainer');
    if (formularioContainer){
        formularioContainer.style.display = 'block';
    }
}

//cerrar y limpiar el formulario
function cerrarFormulario(): void {
    const formularioContainer = document.getElementById('formularioContainer');
    if (formularioContainer){
        formularioContainer.style.display = 'none';
    }
    //limpiar formulario
    (document.getElementById('categoriaForm') as HTMLFormElement).reset();
    editID = null;
}

//configurar el comportamiento del formulario
function setUpFormulario(): void {
    const categoriaForm = document.getElementById('categoriaForm') as HTMLFormElement;
    if (!categoriaForm) return;

    categoriaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = (document.getElementById('name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
        const imageUrl = (document.getElementById('imageUrl') as HTMLInputElement).value;

        if (!nombre || !description || !imageUrl) {
            alert('Todos los campos son obligatorios.');
            return;
        }
        try {
            if (editID !== null) {
              await actualizarCategoria(editID, {
                    id: editID,
                    nombre,
                    description,
                    imageUrl
                });
            } else {
              await crearCategoria({
                    nombre,
                    description,
                    imageUrl
                });
            }
            setUpFormulario();
            loadCategorias();
        } catch (error) {
            console.error('Error al guardar la categoría:', error);
            alert('Error al guardar la categoría. Por favor, intente nuevamente más tarde.');
        }
    });
}

//confirmar eliminacion
async function confirmDelete(id: number): Promise<void> {
    if (!confirm('¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.')) {
        return Promise.resolve();
    }
    try {
        await eliminarCategoria(id);
        await loadCategorias();
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        alert('Error al eliminar la categoría. Por favor, intente nuevamente más tarde.');
    }
}