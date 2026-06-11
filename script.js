const products = [
  {
    id: 1,
    name: "Stampa Alba, formato A3",
    category: "print",
    price: 42,
    description: "Carta naturale 250g, firmata e pronta per cornice.",
    bg: "#f3d6ca",
    shape: "linear-gradient(135deg, #ffffff, #e8c7b8)",
    radius: "6px"
  },
  {
    id: 2,
    name: "Tazza ceramica salvia",
    category: "home",
    price: 34,
    description: "Ceramica smaltata a mano, ideale per caffe e tisane.",
    bg: "#dce8dc",
    shape: "linear-gradient(135deg, #b5cdb9, #6d8c72)",
    radius: "50%"
  },
  {
    id: 3,
    name: "Notebook tela grezza",
    category: "paper",
    price: 26,
    description: "Copertina in tela, 120 pagine puntinate color avorio.",
    bg: "#efe5d1",
    shape: "linear-gradient(135deg, #fff7e6, #b88a44)",
    radius: "8px"
  },
  {
    id: 4,
    name: "Candela studio cedro",
    category: "home",
    price: 29,
    description: "Cera vegetale con note di cedro, ambra e lino pulito.",
    bg: "#e8edf0",
    shape: "linear-gradient(135deg, #f9fbfb, #8b969a)",
    radius: "22px"
  },
  {
    id: 5,
    name: "Set cartoline botaniche",
    category: "paper",
    price: 18,
    description: "Sei soggetti botanici stampati su carta martellata.",
    bg: "#d9e4cd",
    shape: "linear-gradient(135deg, #ffffff, #9fb86f)",
    radius: "4px"
  },
  {
    id: 6,
    name: "Tote bag Atelier",
    category: "home",
    price: 38,
    description: "Canvas pesante, manici rinforzati e stampa serigrafica.",
    bg: "#e9ddd2",
    shape: "linear-gradient(135deg, #fffdf8, #c9715a)",
    radius: "18px"
  }
];

const cart = [];
const productGrid = document.querySelector("#productGrid");
const cartPanel = document.querySelector("#cartPanel");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartCount = document.querySelector("#cartCount");
const cartNote = document.querySelector("#cartNote");
const checkoutButton = document.querySelector("#checkoutButton");
const scrim = document.querySelector("#scrim");
const toast = document.querySelector("#toast");
let toastTimer;

function formatPrice(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

function renderProducts(category = "all") {
  const visibleProducts = category === "all"
    ? products
    : products.filter((product) => product.category === category);

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-art" style="--product-bg: ${product.bg}">
        <div class="product-shape" style="--shape-bg: ${product.shape}; --shape-radius: ${product.radius}"></div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-meta">
          <span class="price">${formatPrice(product.price)}</span>
          <span class="tag">${product.category}</span>
        </div>
        <div class="product-actions">
          <button class="details-button" type="button" data-id="${product.id}">Dettagli</button>
          <button class="add-button" type="button" data-id="${product.id}">Aggiungi</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(total);
  cartNote.textContent = total >= 80
    ? "Spedizione gratuita applicata al checkout demo."
    : `Aggiungi ${formatPrice(80 - total)} per la spedizione gratuita.`;
  checkoutButton.disabled = cart.length === 0;

  if (!cart.length) {
    cartItems.innerHTML = "<p>Il carrello è vuoto.</p>";
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-top">
        <div>
          <h3>${item.name}</h3>
          <p>${formatPrice(item.price)} cad.</p>
        </div>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
      </div>
      <div class="cart-controls">
        <div class="qty-control" aria-label="Quantita ${item.name}">
          <button type="button" data-action="decrease" data-index="${index}" aria-label="Diminuisci quantita">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="increase" data-index="${index}" aria-label="Aumenta quantita">+</button>
        </div>
        <button class="remove-link" type="button" data-action="remove" data-index="${index}">Rimuovi</button>
      </div>
    </div>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
}

function openCart() {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  scrim.classList.add("open");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  scrim.classList.remove("open");
}

document.querySelector(".cart-toggle").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);

document.querySelector(".filters").addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;

  document.querySelectorAll(".filter").forEach((filter) => filter.classList.remove("active"));
  button.classList.add("active");
  renderProducts(button.dataset.filter);
});

productGrid.addEventListener("click", (event) => {
  const detailButton = event.target.closest(".details-button");
  const addButton = event.target.closest(".add-button");
  const button = detailButton || addButton;
  if (!button) return;

  const product = products.find((item) => item.id === Number(button.dataset.id));
  if (detailButton) {
    showToast(`${product.name}: ${product.description}`);
    return;
  }

  addToCart(product);
  renderCart();
  showToast(`${product.name} aggiunto al carrello.`);
  openCart();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  const item = cart[index];

  if (button.dataset.action === "increase") {
    item.quantity += 1;
  }

  if (button.dataset.action === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart.splice(index, 1);
    }
  }

  if (button.dataset.action === "remove") {
    cart.splice(index, 1);
  }

  renderCart();
});

checkoutButton.addEventListener("click", () => {
  if (!cart.length) return;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartItems.innerHTML = `
    <div class="checkout-summary">
      <h3>Checkout demo pronto</h3>
      <p>Totale ordine: <strong>${formatPrice(total)}</strong></p>
      <p>Qui puoi collegare Stripe, Shopify Buy Button, WooCommerce o un backend personalizzato.</p>
    </div>
  `;
  showToast("Checkout demo generato.");
});

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Grazie, richiesta ricevuta.");
});

renderProducts();
renderCart();
