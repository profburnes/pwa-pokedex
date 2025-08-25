let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const installButton = document.getElementById('install-btn');

// Captura o evento antes da instalação
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Impede o banner automático
  deferredPrompt = e; // Salva o evento
  installBanner.style.display = 'block'; // Mostra o banner personalizado
});

// Clique no botão de instalar
installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt(); // Mostra o prompt
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    console.log('Usuário aceitou a instalação');
  } else {
    console.log('Usuário recusou a instalação');
  }

  installBanner.style.display = 'none'; // Esconde o banner
  deferredPrompt = null; // Limpa o evento
});

// Opcional: esconder o banner se o app já estiver instalado
window.addEventListener('appinstalled', () => {
  console.log('PWA instalado');
  installBanner.style.display = 'none';
});