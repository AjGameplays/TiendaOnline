const products = [...document.querySelectorAll('.product-card')];
const filters = [...document.querySelectorAll('.filter')];
const searchInput = document.querySelector('#productSearch');
const emptyState = document.querySelector('#emptyState');
const cartPanel = document.querySelector('#cartPanel');
const overlay = document.querySelector('#overlay');
const cartItems = document.querySelector('#cartItems');
const cartCount = document.querySelector('#cartCount');
const cartTotal = document.querySelector('#cartTotal');
const whatsappNumber = '5491100000000';
let activeFilter = 'all';
let cart = [];

function formatPrice(value) {
  return `$ ${value.toLocaleString('es-AR')}`;
}

function renderProducts() {
  const query = searchInput.value.toLowerCase().trim();
  let visible = 0;
  products.forEach((product) => {
    const matchesFilter = activeFilter === 'all' || product.dataset.category === activeFilter;
    const matchesSearch = product.dataset.name.includes(query);
    const show = matchesFilter && matchesSearch;
    product.hidden = !show;
    if (show) visible += 1;
  });
  emptyState.hidden = visible !== 0;
}

function renderCart() {
  cartCount.textContent = cart.length;
  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío.<br>La mejor jugada todavía no llegó.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `<div class="cart-row"><span>${item.name}<br><small>${formatPrice(item.price)}</small></span><button type="button" data-remove="${index}" aria-label="Quitar ${item.name}">×</button></div>`).join('');
  }
  cartTotal.textContent = formatPrice(cart.reduce((total, item) => total + item.price, 0));
}

function toggleCart(open) {
  cartPanel.classList.toggle('open', open);
  overlay.classList.toggle('visible', open);
  cartPanel.setAttribute('aria-hidden', String(!open));
}

filters.forEach((filter) => filter.addEventListener('click', () => {
  activeFilter = filter.dataset.filter;
  filters.forEach((item) => item.classList.toggle('active', item === filter));
  renderProducts();
}));
searchInput.addEventListener('input', renderProducts);
document.querySelectorAll('.add-button').forEach((button) => button.addEventListener('click', () => {
  cart.push({ name: button.dataset.product, price: Number(button.dataset.price) });
  renderCart();
  toggleCart(true);
}));
cartItems.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove]');
  if (!removeButton) return;
  cart.splice(Number(removeButton.dataset.remove), 1);
  renderCart();
});
document.querySelector('#cartToggle').addEventListener('click', () => toggleCart(true));
document.querySelector('#cartClose').addEventListener('click', () => toggleCart(false));
overlay.addEventListener('click', () => toggleCart(false));
document.querySelector('#menuToggle').addEventListener('click', () => document.querySelector('.main-nav').classList.toggle('mobile-open'));
document.querySelector('#searchToggle').addEventListener('click', () => {
  if (document.body.classList.contains('home-page')) {
    window.location.href = 'tienda.html';
    return;
  }
  searchInput.focus();
  document.querySelector('#tienda').scrollIntoView();
});
document.querySelector('.whatsapp-button').addEventListener('click', () => {
  if (!cart.length) {
    alert('Agrega al menos un producto para preparar tu pedido.');
    return;
  }
  const lines = cart.map((item) => `- ${item.name}: ${formatPrice(item.price)}`);
  const total = formatPrice(cart.reduce((sum, item) => sum + item.price, 0));
  const message = ['Hola, quiero consultar por este pedido:', '', ...lines, '', `Total estimado: ${total}`, '', '¿Me confirman disponibilidad, envío y formas de pago?'].join('\n');
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
renderCart();