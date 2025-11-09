
import type { ICart } from '../types/ICart';

const cart_key = 'cart';

export function getCart(): ICart {
    const cartStr = localStorage.getItem(cart_key);
    return cartStr ? JSON.parse(cartStr) : { items: [] };
}

export function saveCart (cart: ICart): void {
    localStorage.setItem(cart_key, JSON.stringify(cart));
}

export function clearCart(): void {
    localStorage.removeItem(cart_key);
}

export function addToCart(idProducto: number, nombre: string, precio: number, imagenUrl: string, cantidad: number): void{
  const cart = getCart();
  const existingItem = cart.items.find(item => item.idProducto === idProducto);

  if (existingItem) {
    // Si el producto ya está en el carrito, actualiza la cantidad
    existingItem.cantidad += cantidad;
  } else {
    // Si no está, añade un nuevo ítem
    cart.items.push({ idProducto: idProducto, nombre: nombre, precio: precio, cantidad: cantidad, imagenUrl: imagenUrl });
  }

  saveCart(cart);
}

export function updateItemCantidad(idProducto: number, newCantidad: number): void{
  const cart = getCart();
  const item = cart.items.findIndex(item => item.idProducto === idProducto);

  if (item) {
    if (newCantidad <= 0) {
      removeItem(idProducto);
    } else {
      // Actualiza la cantidad
      cart.items[item].cantidad = newCantidad;
    }
    saveCart(cart);
  }
}

export function removeItem(idProducto: number): void{
  const cart = getCart();
  cart.items = cart.items.filter(item => item.idProducto !== idProducto);
  saveCart(cart);
}

export function calcularSubtotal(): number{
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

export function calcularTotal(envioCosto: number = 500): number{
  const subTotal = calcularSubtotal();
  return subTotal + envioCosto;
}

export function getTotalItems(): number{
  const cart = getCart();
  return cart.items.reduce((count, item) => count + item.cantidad, 0);
}