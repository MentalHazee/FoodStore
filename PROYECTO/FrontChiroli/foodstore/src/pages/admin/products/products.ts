const API_URL = ''; // dirección base del backend (localhost en desarrollo)
import type { IProduct } from "../../../types/IProduct";
import { getCategorias, getProductos } from "../../../utils/api";
import type { ICategoria } from "../../../types/ICategoria";

//crear un nuevo producto (solo admin)
export async function crearProducto(productoData: Omit<IProduct, 'id'>): Promise<IProduct>{
    const response = await fetch(`${API_URL}/api/productos`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData)
    });
    if (!response.ok) {
        throw new Error('No se pudo crear el producto');
    }
    return response.json();
}

//actualizar un producto (solo admin)
export async function actualizarProducto(id: number, productoData: IProduct): Promise<IProduct>{
    const response = await fetch(`${API_URL}/api/productos/${id}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData)
    });
    if (!response.ok) {
        throw new Error('No se pudo actualizar el producto');
    }
    return response.json();
}

//eliminar un producto (solo admin)
export async function eliminarProducto(id: number): Promise<void>{
    const response = await fetch(`${API_URL}/api/productos/${id}`,{
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('No se pudo eliminar el producto');
    }
}

let productosCache: IProduct[] | null = null;
let editID: number | null = null;
let categoriasCache: ICategoria[] | null = null;

document.addEventListener('DOMContentLoaded', async () => {
    try{
        //cargar productos y categoria en paralelo
        const [productosData, categoriasData] = await Promise.all([getProductos(), getCategorias()]);
        productosCache = productosData;
        categoriasCache = categoriasData;
        renderProductosTable();
        populateCategoriaSelect();
        setUpFormulario();

        const btnNewProducto = document.getElementById('btnNewProducto');
        btnNewProducto?.addEventListener('click', () => {
            editID = null;
            abrirFormulario();
            (document.getElementById('productoForm') as HTMLFormElement).reset();
        });
        const btnCancelar = document.getElementById('btnCancelar');
        btnCancelar?.addEventListener('click', cerrarFormulario);
    }catch (error) {
        console.error('Error al cargar la pagina de productos:', error);
        alert('Error al cargar la pagina de productos. Por favor, intente nuevamente más tarde.');
    }
});

//renderizar la tabla de productos
function renderProductosTable(): void{
    const tbody = document.querySelector('#productosTable tbody');
    if (!tbody) return;

    if (productosCache?.length === 0){
        tbody.innerHTML = '<tr><td colspan="6">No hay productos disponibles.</td></tr>';
        return;
    }

    tbody.innerHTML = productosCache!.map(producto => `
        <tr>
            <td>${producto.id}</td>
            <td><img src="${producto.imageURL}" alt="${producto.nombre}" width="50" /></td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${categoriasCache?.find(c => c.id === producto.categoriaId)?.nombre || '—'}</td>
            <td>${producto.stock}</td>
            <td>
                <span class="badge ${producto.disponible ? 'available' : 'unavailable'}">
                    ${producto.disponible ? 'Disponible' : 'No disponible'}
                </span>
            </td>
            <td>
                <button class="btn-edit" data-id="${producto.id}">Editar</button>
                <button class="btn-delete" data-id="${producto.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');

    //agregar eventos a los botones
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).dataset.id);
            editProducto(id);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLElement).dataset.id);
            confirmDelete(id); // Preguntar antes de borrar
        });
    });
}

//llenar el select de categorias en el formulario
function populateCategoriaSelect(): void{
    const select = document.getElementById('categoriaId') as HTMLSelectElement;
    if (!select) return;

    select.innerHTML ='';
    categoriasCache?.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id.toString();
        option.textContent = categoria.nombre;
        select.appendChild(option);
    });
}

function editProducto(id: number): void{
    const producto = productosCache?.find(p => p.id === id);
    if (!producto) return;

    //rellenar el formulario con los datos del producto
    (document.getElementById('nombre') as HTMLInputElement).value = producto.nombre;
    (document.getElementById('descripcion') as HTMLTextAreaElement).value = producto.descripcion;
    (document.getElementById('precio') as HTMLInputElement).value = producto.precio.toString();
    (document.getElementById('stock') as HTMLInputElement).value = producto.stock.toString();
    (document.getElementById('imageURL') as HTMLInputElement).value = producto.imageURL;
    (document.getElementById('disponible') as HTMLInputElement).checked = producto.disponible;
    (document.getElementById('categoriaId') as HTMLSelectElement).value = producto.categoriaId.toString();
    //guardamos el id para saber que estamos editando
    editID = id;
    abrirFormulario();
} 

function abrirFormulario(): void{
    const formularioContainer = document.getElementById('formularioContainer');
    if (formularioContainer){
        formularioContainer.style.display = 'block';
    }
}

function cerrarFormulario(): void{
    const formularioContainer = document.getElementById('formularioContainer');
    if (formularioContainer){
        formularioContainer.style.display = 'none';
    }
    const productoForm = document.getElementById('productoForm') as HTMLFormElement | null;
    if (productoForm) {
        productoForm.reset();
    }
    // limpiar estado de edición
    editID = null;
}

function setUpFormulario(): void{
    const productoForm = document.getElementById('productoForm') as HTMLFormElement;
    if (!productoForm) return;
    productoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
        const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;
        const precio = parseFloat((document.getElementById('precio') as HTMLInputElement).value);
        const stock = parseInt((document.getElementById('stock') as HTMLInputElement).value, 10);
        const imageURL = (document.getElementById('imageURL') as HTMLInputElement).value;
        const disponible = (document.getElementById('disponible') as HTMLInputElement).checked;
        const categoriaId = parseInt((document.getElementById('categoriaId') as HTMLSelectElement).value, 10);

        if (!nombre || !descripcion || !imageURL){
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        if (isNaN(precio) || precio <= 0) {
            alert('El precio debe ser un número mayor a 0.');
            return;
        }
        if (isNaN(stock) || stock < 0) {
            alert('El stock debe ser un número igual o mayor a 0.');
            return;
        }

        try {
            const productoData = {
                nombre,
                descripcion,
                precio,
                stock,
                imageURL,
                disponible,
                categoriaId
            } as Omit<IProduct, 'id'>;

            if (editID !== null) {
                // Modo EDICIÓN
                await actualizarProducto(editID, { ...productoData, id: editID } as IProduct);
            } else {
                // Modo CREACIÓN
                await crearProducto(productoData);
            }

            // Recargar datos y actualizar interfaz
            const [updatedProductos] = await Promise.all([
            getProductos(),
            getCategorias()
            ]);
            productosCache = updatedProductos;
            renderProductosTable();
            cerrarFormulario();
        } catch (error) {
            alert('Error: ' + (error as Error).message);
        }
    });
}

//confirmar y eliminar un producto
async function confirmDelete(id: number): Promise<void>{
    if (!confirm('¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.')){
        return;
    }
    try{
        await eliminarProducto(id);
        productosCache = await getProductos();
        renderProductosTable();
    }catch (error){
        console.error('Error al eliminar el producto:', error);
        alert('Error al eliminar el producto. Por favor, intente nuevamente más tarde.');
    }
}