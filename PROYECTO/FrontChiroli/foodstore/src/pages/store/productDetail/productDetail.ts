interface IProduct {
  stock: number;
}

function renderProductDetail(product: IProduct): void {
  const isAvailable = product.stock > 0;

  document.getElementById('productStatus')!.textContent = isAvailable ? 'Disponible' : 'Agotado';
  document.getElementById('productStatus')!.className = isAvailable ? 'status available' : 'status unavailable';

  const addToCartBtn = document.getElementById('addToCartBtn') as HTMLButtonElement;
  addToCartBtn.disabled = !isAvailable;

  const quantityInput = document.getElementById('quantity') as HTMLInputElement;
  quantityInput.max = product.stock.toString();
}