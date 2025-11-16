export function modalCancelarPedido(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmationModal');
    const messageElement = document.getElementById('confirmationMessage');
    const yesButton = document.getElementById('confirmYesBtn');
    const noButton = document.getElementById('confirmNoBtn');

    if (!modal || !messageElement || !yesButton || !noButton) {
      console.error("No se encontraron elementos del modal de confirmación.");
      resolve(false); // Por defecto, cancelar
      return;
    }

    // Mostrar el modal
    messageElement.textContent = message;
    modal.style.display = 'flex'; // Usa 'flex' para centrar

    // Manejar clic en "Sí"
    const onYesClick = () => {
      modal.style.display = 'none';
      yesButton.removeEventListener('click', onYesClick);
      noButton.removeEventListener('click', onNoClick);
      resolve(true);
    };

    // Manejar clic en "No" o fuera del modal
    const onNoClick = () => {
      modal.style.display = 'none';
      yesButton.removeEventListener('click', onYesClick);
      noButton.removeEventListener('click', onNoClick);
      resolve(false);
    };

    // Asociar eventos
    yesButton.addEventListener('click', onYesClick);
    noButton.addEventListener('click', onNoClick);

    // Cerrar al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        onNoClick();
      }
    });
  });
}