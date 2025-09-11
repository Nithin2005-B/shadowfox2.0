const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, "orders.json");

// Middleware
app.use(cors());
app.use(express.json());

// Ensure orders.json exists
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");

// Read orders
function readOrders() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// Save orders
function saveOrders(orders) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

// Test route
app.get("/", (req, res) => res.send("SLV Shop Backend Running ✅"));

// Get all orders
app.get("/orders", (req, res) => res.json(readOrders()));

// Add new order
app.post("/orders", (req, res) => {
  const { id, name, address, payment, items, total } = req.body;
  if (!name || !address || !payment || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid order data" });
  }

  const orders = readOrders();
  const newOrder = {
    id: id || Date.now(),   // ✅ Use frontend id if provided
    name,
    address,
    payment,
    items,
    total,
    date: new Date().toLocaleString()
  };

  orders.push(newOrder);
  saveOrders(orders);

  res.json({ success: true, order: newOrder });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});
// Delete order (optional)
app.delete("/orders/:id", (req, res) => {
  const orderId = Number(req.params.id);
  let orders = readOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return res.status(404).json({ success: false, message: "Order not found" });
  orders.splice(index, 1);
  saveOrders(orders);
  res.json({ success: true, message: "Order deleted" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
