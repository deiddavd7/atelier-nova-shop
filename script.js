const products = [
  {
    id: 1,
    name: "Stampa Alba, formato A3",
    category: "print",
    price: 42,
    description: "Carta naturale 250g, firmata e pronta per cornice.",
    materials: "Carta naturale 250g, stampa pigmentata",
    size: "29,7 × 42 cm",
    stock: "12 copie numerate",
    bg: "#f3d6ca",
    shape: "linear-gradient(135deg, #ffffff, #e8c7b8)",
    radius: "6px"
  },
  {
    id: 2,
    name: "Tazza ceramica salvia",
    category: "home",
    price: 34,
    description: "Ceramica smaltata a mano, ideale per caffè e tisane.",
    materials: "Gres smaltato, finitura satinata",
    size: "300 ml",
    stock: "8 pezzi disponibili",
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
    materials: "Tela grezza, carta FSC color avorio",
    size: "A5, 120 pagine",
    stock: "18 pezzi disponibili",
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
    materials: "Cera vegetale, stoppino cotone, vetro ambrato",
    size: "180 g",
    stock: "15 pezzi disponibili",
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
    materials: "Carta martellata 300g",
    size: "Set da 6, formato A6",
    stock: "24 set disponibili",
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
    materials: "Canvas cotone, stampa serigrafica",
    size: "38 × 42 cm",
    stock: "10 pezzi disponibili",
    bg: "#e9ddd2",
    shape: "linear-gradient(135deg, #fffdf8, #c9715a)",
    radius: "18px"
  }
];

const cart = [];
const favorites = new Set(JSON.parse(localStorage.getItem("atelierNovaFavorites") || "[]"));
let activeFilter = "all";
let searchTerm = "";
let sortMode = "featured";
const productGrid = document.querySelector("#productGrid");
const productSearch = document.querySelector("#productSearch");
const productSort = document.querySelector("#productSort");
const resultsCount = document.querySelector("#resultsCount");
const favoriteCount = document.querySelector("#favoriteCount");
const cartPanel = document.querySelector("#cartPanel");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartCount = document.querySelector("#cartCount");
const cartNote = document.querySelector("#cartNote");
const checkoutButton = document.querySelector("#checkoutButton");
const scrim = document.querySelector("#scrim");
const toast = document.querySelector("#toast");
const productModal = document.querySelector("#productModal");
const checkoutModal = document.querySelector("#checkoutModal");
const modalArt = document.querySelector("#modalArt");
const modalCategory = document.querySelector("#modalCategory");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalMaterials = document.querySelector("#modalMaterials");
const modalSize = document.querySelector("#modalSize");
const modalStock = document.querySelector("#modalStock");
const modalPrice = document.querySelector("#modalPrice");
const modalAddButton = document.querySelector("#modalAddButton");
const checkoutSummary = document.querySelector("#checkoutSummary");
const checkoutForm = document.querySelector(".checkout-card");
const backToTop = document.querySelector("#backToTop");
let toastTimer;
let activeProductId = null;

function formatPrice(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

function getVisibleProducts() {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeFilter === "all"
      || product.category === activeFilter
      || (activeFilter === "favorites" && favorites.has(product.id));
    const matchesSearch = !normalizedSearch
      || product.name.toLowerCase().includes(normalizedSearch)
      || product.description.toLowerCase().includes(normalizedSearch)
      || product.materials.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  return [...filteredProducts].sort((a, b) => {
    if (sortMode === "price-asc") return a.price - b.price;
    if (sortMode === "price-desc") return b.price - a.price;
    if (sortMode === "name") return a.name.localeCompare(b.name, "it");
    return a.id - b.id;
  });
}

function saveFavorites() {
  localStorage.setItem("atelierNovaFavorites", JSON.stringify([...favorites]));
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  const label = visibleProducts.length === 1 ? "prodotto disponibile" : "prodotti disponibili";
  favoriteCount.textContent = favorites.size;
  resultsCount.textContent = visibleProducts.length
    ? `${visibleProducts.length} ${label}`
    : "Nessun prodotto trovato";

  if (!visibleProducts.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <h3>Nessun prodotto trovato</h3>
        <p>Prova a cambiare ricerca, filtro o ordinamento.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card reveal">
      <div class="product-art" style="--product-bg: ${product.bg}">
        <button class="favorite-button ${favorites.has(product.id) ? "active" : ""}" type="button" data-id="${product.id}" aria-label="${favorites.has(product.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}">♥</button>
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
  observeRevealItems();
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

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

function openModal(modal) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModals() {
  document.querySelectorAll(".modal.open").forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("modal-open");
}

function openProductModal(product) {
  activeProductId = product.id;
  modalArt.style.setProperty("--product-bg", product.bg);
  modalArt.style.setProperty("--shape-bg", product.shape);
  modalArt.style.setProperty("--shape-radius", product.radius);
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalMaterials.textContent = product.materials;
  modalSize.textContent = product.size;
  modalStock.textContent = product.stock;
  modalPrice.textContent = formatPrice(product.price);
  openModal(productModal);
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
  activeFilter = button.dataset.filter;
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest(".favorite-button");
  const detailButton = event.target.closest(".details-button");
  const addButton = event.target.closest(".add-button");
  const button = favoriteButton || detailButton || addButton;
  if (!button) return;

  const product = products.find((item) => item.id === Number(button.dataset.id));
  if (favoriteButton) {
    if (favorites.has(product.id)) {
      favorites.delete(product.id);
      showToast(`${product.name} rimosso dai preferiti.`);
    } else {
      favorites.add(product.id);
      showToast(`${product.name} salvato nei preferiti.`);
    }
    saveFavorites();
    renderProducts();
    return;
  }

  if (detailButton) {
    openProductModal(product);
    return;
  }

  addToCart(product);
  renderCart();
  showToast(`${product.name} aggiunto al carrello.`);
  openCart();
});

modalAddButton.addEventListener("click", () => {
  const product = products.find((item) => item.id === activeProductId);
  if (!product) return;

  addToCart(product);
  renderCart();
  closeModals();
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

productSearch.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderProducts();
});

productSort.addEventListener("change", (event) => {
  sortMode = event.target.value;
  renderProducts();
});

checkoutButton.addEventListener("click", () => {
  if (!cart.length) return;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const itemLabel = itemCount === 1 ? "articolo" : "articoli";
  checkoutSummary.textContent = `${itemCount} ${itemLabel} · totale ${formatPrice(getCartTotal())}. Questo form è pronto per essere collegato a un pagamento reale.`;
  closeCart();
  openModal(checkoutModal);
});

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Grazie, richiesta ricevuta.");
});

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Iscrizione demo registrata.");
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  cart.splice(0, cart.length);
  renderCart();
  closeModals();
  showToast("Ordine demo confermato.");
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModals);
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModals();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeModals();
  }
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 })
  : null;

function observeRevealItems() {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => {
    if (revealObserver) {
      revealObserver.observe(item);
    } else {
      item.classList.add("is-visible");
    }
  });
}

document.querySelectorAll(".section, .stats div, .work-card, .service-card, .testimonial-band, .faq-list details").forEach((item) => {
  item.classList.add("reveal");
});

const navLinks = [...document.querySelectorAll(".main-nav a")];
const sectionsByNav = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" })
  : null;

if (navObserver) {
  sectionsByNav.forEach((section) => navObserver.observe(section));
}

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 760);
}, { passive: true });

renderProducts();
renderCart();
observeRevealItems();
