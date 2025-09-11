// ===== Navbar Toggle =====
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

// ===== Products Data =====
const products = [
  // Clothing
  { id: 1, name: "Men Black T-Shirt", price: 499, category: "clothing", image: "tshirt1.jpg" },
  { id: 2, name: "Women Blue Jeans", price: 1299, category: "clothing", image: "jeans1.jpg" },
  { id: 3, name: "Red Kurta", price: 999, category: "clothing", image: "kurta1.jpg" },
  { id: 4, name: "Floral Saree", price: 2499, category: "clothing", image: "saree1.jpg" },
  { id: 5, name: "Men Sneakers", price: 1999, category: "clothing", image: "sneakers1.jpg" },
  { id: 6, name: "Women Heels", price: 1799, category: "clothing", image: "heels1.jpg" },
  { id: 16, name: "Casual Shirt", price: 1199, category: "clothing", image: "shirt1.jpg" },
  { id: 17, name: "Sports Shoes", price: 2499, category: "clothing", image: "sportshoes1.jpg" },
  { id: 18, name: "Jacket", price: 2999, category: "clothing", image: "jacket1.jpg" },
  { id: 19, name: "Ethnic Kurti", price: 1099, category: "clothing", image: "kurti1.jpg" },
  { id: 20, name: "Cap", price: 399, category: "clothing", image: "cap1.jpg" },

  // Electronics
  { id: 7, name: "Wireless Headphones", price: 1499, category: "electronics", image: "headphones1.jpg" },
  { id: 8, name: "Bluetooth Speaker", price: 2999, category: "electronics", image: "speaker1.jpg" },
  { id: 9, name: "Smart Watch", price: 2599, category: "electronics", image: "watch1.jpg" },
  { id: 10, name: "Gaming Mouse", price: 899, category: "electronics", image: "mouse1.jpg" },
  { id: 11, name: "Laptop Backpack", price: 1499, category: "electronics", image: "backpack1.jpg" },

  // Accessories
  { id: 12, name: "Sunglasses", price: 699, category: "accessories", image: "sunglasses1.jpg" },
  { id: 13, name: "Leather Wallet", price: 799, category: "accessories", image: "wallet1.jpg" },
  { id: 14, name: "Gold Plated Earrings", price: 1299, category: "accessories", image: "earrings1.jpg" },
  { id: 15, name: "Handbag", price: 1599, category: "accessories", image: "handbag1.jpg" }
];


// ===== Cart =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-link span");
  if (!badge) return;
  badge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  updateCartBadge();
  alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
  updateCartBadge();
}
function changeQuantity(productId, delta) {
  cart = cart.map(item => {
    if (item.id === productId) {
      item.quantity += delta;
      if (item.quantity < 1) item.quantity = 1; // minimum 1
    }
    return item;
  });
  saveCart();
  renderCart();
  updateCartBadge();
}


function renderCart() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
     <div>
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <div class="quantity-controls">
          <button onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = total;
}

function displayProducts(items) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get("category");
  let filteredItems = items;

  if (selectedCategory) {
  filteredItems = items.filter(
    p => p.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
  );
}

if (filteredItems.length === 0) {
  // If no products in this category, show all instead
  filteredItems = items;
}


  filteredItems.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    grid.appendChild(div);
  });
}

// ===== Filters & Search =====
const filterCategory = document.getElementById("filterCategory");
const sortPrice = document.getElementById("sortPrice");
const searchInput = document.getElementById("searchInput");

function applyFilters() {
  let filtered = [...products];

  if (filterCategory && filterCategory.value !== "all") {
    filtered = filtered.filter(p => p.category === filterCategory.value);
  }

  if (searchInput && searchInput.value.trim() !== "") {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchInput.value.toLowerCase()));
  }

  if (sortPrice) {
    if (sortPrice.value === "low-high") filtered.sort((a, b) => a.price - b.price);
    if (sortPrice.value === "high-low") filtered.sort((a, b) => b.price - a.price);
  }

  displayProducts(filtered);
}

if (filterCategory) filterCategory.addEventListener("change", applyFilters);
if (sortPrice) sortPrice.addEventListener("change", applyFilters);
if (searchInput) searchInput.addEventListener("input", applyFilters);


// ===== Checkout =====
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.getElementById("payment").value;

    if (!name || !address || !payment) {
      alert("Fill all details!");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const newOrder = {
      id: Date.now(),
      name,
      address,
      payment,
      items: cart,
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      date: new Date().toLocaleString()
    };
try {
  // Send to backend
  const response = await fetch("http://localhost:5000/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newOrder),
  });

  const data = await response.json();

  if (data.success) {
    alert("✅ Order placed successfully (saved on backend)!");

    // 🔑 Save backend’s version (correct ID)
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(data.order); // ✅ Use backend order object
    localStorage.setItem("orders", JSON.stringify(orders));
  } else {
    throw new Error("Backend rejected order");
  }
} catch (err) {
  console.warn("⚠ Backend not available, saving order locally.", err);
  alert("✅ Order placed successfully (saved locally)!");

  // 🔑 Save frontend’s version only if backend failed
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
}

// Clear cart
cart = [];
saveCart();
updateCartBadge();

// Redirect
window.location.href = "order-history.html";
});
}


// ===== Order History =====
function renderOrders() {
  const ordersList = document.getElementById("ordersList");
if (ordersList) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (orders.length === 0) {
    ordersList.innerHTML = "<p>No past orders found.</p>";
  } else {
    orders.forEach(order => {
      const div = document.createElement("div");
      div.classList.add("order-card");
      div.innerHTML = `
        <h4>Order #${order.id}</h4>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Payment:</strong> ${order.payment}</p>
        <p><strong>Date:</strong> ${order.date}</p>
        <p><strong>Total:</strong> ₹${order.total}</p>
        <ul>${order.items.map(i => `<li>${i.name} x ${i.quantity}</li>`).join("")}</ul>
      `;
      ordersList.appendChild(div);
    });
  }
}
  fetch("http://localhost:5000/orders")
    .then(res => res.json())
    .then(orders => {
      container.innerHTML = "";
      if (orders.length === 0) {
        container.innerHTML = "<p>No orders yet.</p>";
        return;
      }

      orders.forEach(order => {
        const div = document.createElement("div");
        div.classList.add("order-card");
        div.innerHTML = `
          <h3>Order #${order.id}</h3>
          <p><strong>Name:</strong> ${order.name}</p>
          <p><strong>Address:</strong> ${order.address}</p>
          <p><strong>Payment:</strong> ${order.payment}</p>
          <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
          <h4>Items:</h4>
          <ul>
            ${order.items.map(i => `<li>${i.name} x ${i.quantity} - ₹${i.price * i.quantity}</li>`).join("")}
          </ul>
          <p><strong>Total:</strong> ₹${order.total}</p>
        `;
        container.appendChild(div);
      });
    });
}

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  if (document.getElementById("productGrid")) displayProducts(products);
  if (document.getElementById("cartItems")) renderCart();
  if (document.getElementById("ordersList")) renderOrders();
});
