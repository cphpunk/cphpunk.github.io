export function registerInteractions() {
  const infoButton = document.getElementById('infoButton');
  const infoModal  = document.getElementById('infoModal');

  console.assert(infoButton, 'Info button not found');
  console.assert(infoModal, 'Info modal not found');

  const infoCloseButton = infoModal.querySelector('.close');
  const infoModalContent = infoModal.querySelector('.modal-content');

  infoButton.addEventListener('click', () => {
    infoModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });

  if (infoCloseButton) {
    infoCloseButton.addEventListener('click', () => {
      infoModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === infoModal) {
      infoModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // iOS fix for outside touch
  infoModal.addEventListener('touchend', (event) => {
    if (event.target === infoModal) {
      event.preventDefault();
      event.stopPropagation();
      infoModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }, { passive: false });

  // Prevent scroll inside the modal content
  if (infoModalContent) {
    infoModalContent.addEventListener('touchmove', function (event) {
      event.stopPropagation();
    }, { passive: false });
  }
}