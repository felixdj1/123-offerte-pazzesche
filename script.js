// Lista prodotti di esempio
const products = [
  { id: 1, name: "Smartphone", desc: "Telefono da Amazon / AliExpress", price: 199.99, img: "images/prodotto1.jpg", category: "elettronica", discount: 10 },
  { id: 2, name: "Lampada da tavolo", desc: "Luce da casa moderna", price: 34.50, img: "images/prodotto2.jpg", category: "casa", discount: 5 },
  { id: 3, name: "Scarpe da corsa", desc: "Sport / Marca simile ad eBay", price: 59.90, img: "images/prodotto3.jpg", category: "sport" },
  { id: 4, name: "Portachiavi", desc: "Gadget simpatico", price: 5.99, img: "images/prodotto4.jpg", category: "gadget", discount: 50 },
  { id: 5, name: "T-shirt", desc: "Maglietta abbigliamento", price: 14.99, img: "images/prodotto5.jpg", category: "abbigliamento" },
];

// Carrello
let cart = JSON.parse(localStorage.getItem("cart")) || {};

// Elementi DOM
const productsEl = document.getElementById("products");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

const popupEl = document.getElementById("popup-offerta");
const closePopupBtn = document.getElementById("close-popup");

const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-img");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");
const addToCartModalBtn = document.getElementById("add-to-cart-modal");
const modalClose = document.getElementById("modal-close");

let modalCurrentProduct = null;

// Funzioni

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  cartCountEl.textContent = Object.values(cart).reduce((sum, q) => sum + q, 0);
  cartItemsEl.innerHTML = "";
  let total = 0;
  for (const id in cart) {
    const prod = products.find(p => p.id == id);
    const qty = cart[id];
    const line = document.createElement("div");
    line.textContent = `${prod.name} x${qty} — €${(prod.price * qty).toFixed(2)}`;
    cartItemsEl.appendChild(line);
    total += prod.price * qty;
  }
  cartTotalEl.textContent = total.toFixed(2);
}

function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart();
  updateCartUI();
}

// Render prodotti
function renderProducts(filter = "all") {
  productsEl.innerHTML = "";
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" class="prod-img" />
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div>€${p.price.toFixed(2)}</div>
      ${p.discount ? `<div class="offerta">-${p.discount}%</div>` : ""}
      <button class="btn-add">Aggiungi</button>
    `;
    // Aggiungi evento per il pulsante
    card.querySelector(".btn-add").addEventListener("click", () => addToCart(p.id));
    // Evento per aprire la modal al click su immagine
    card.querySelector(".prod-img").addEventListener("click", () => {
      modalCurrentProduct = p;
      modalImg.src = p.img;
      modalName.textContent = p.name;
      modalDesc.textContent = p.desc;
      modalPrice.textContent = p.price.toFixed(2);
      modal.classList.remove("hidden");
    });
    productsEl.appendChild(card);
  });
}

// Popup offerte lampo
function showPopupOfferta() {
  popupEl.classList.remove("hidden");
  setTimeout(() => {
    popupEl.classList.add("hidden");
  }, 5000);
}

// Gestione modal
modalClose.addEventListener("click", () => modal.classList.add("hidden"));
addToCartModalBtn.addEventListener("click", () => {
  if (modalCurrentProduct) addToCart(modalCurrentProduct.id);
  modal.classList.add("hidden");
});

// Filtra per categoria
document.getElementById("categories").addEventListener("click", e => {
  if (e.target.dataset.cat) {
    renderProducts(e.target.dataset.cat);
  }
});

// Carrello visibile
document.getElementById("toggle-cart").addEventListener("click", () => {
  document.getElementById("cart").classList.toggle("hidden");
});
document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("cart").classList.add("hidden");
});

// Dark mode automatico
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add("dark");
}

// Inizializzazione
renderProducts();
updateCartUI();
setInterval(showPopupOfferta, 15000);
