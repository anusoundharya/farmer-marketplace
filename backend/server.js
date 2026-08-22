const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const AUTH_SECRET = process.env.AUTH_SECRET || "change-this-secret-in-production";
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "farmdirect",
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(cors());
app.use(express.json());

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => ({
  salt,
  hash: crypto.scryptSync(password, salt, 64).toString("hex"),
});

const verifyPassword = (password, salt, expectedHash) => {
  const actualHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actualHash, "hex"), Buffer.from(expectedHash, "hex"));
};

const createToken = (userId) => {
  const payload = `${userId}.${Date.now() + 24 * 60 * 60 * 1000}`;
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
};

const userIdFromRequest = (req) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;
  const payload = Buffer.from(encodedPayload, "base64url").toString();
  const expectedSignature = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
  if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
  const [userId, expiresAt] = payload.split(".");
  return Number(expiresAt) > Date.now() ? Number(userId) : null;
};

const userFromRequest = async (req) => {
  const userId = userIdFromRequest(req);
  if (!userId) return null;
  const [rows] = await pool.query("SELECT id, name, email, phone, role FROM users WHERE id = ?", [userId]);
  return rows[0] || null;
};

const initializeDatabase = async () => {
  const databaseName = process.env.DB_NAME || "farmdirect";
  const adminPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  });
  await adminPool.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  await adminPool.end();

  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, phone VARCHAR(30) NOT NULL,
    password_hash CHAR(128) NOT NULL, password_salt CHAR(32) NOT NULL,
    role ENUM('customer', 'farmer') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY, farmer_id INT NOT NULL,
    name VARCHAR(120) NOT NULL, category VARCHAR(60) NOT NULL,
    emoji VARCHAR(10) DEFAULT '🥕', quantity DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL, location VARCHAR(120) NOT NULL,
    sold_out BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY, order_code VARCHAR(30) NOT NULL UNIQUE,
    customer_id INT NOT NULL, customer_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL, address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL, pincode VARCHAR(12) NOT NULL,
    payment VARCHAR(40) NOT NULL, total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(40) DEFAULT 'Order Placed', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY, order_id INT NOT NULL,
    product_id INT NOT NULL, product_name VARCHAR(120) NOT NULL,
    farmer VARCHAR(120) NOT NULL, emoji VARCHAR(10), price DECIMAL(10, 2) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  )`);
};

app.get("/", (req, res) => res.json({ message: "FarmDirect Backend is running successfully" }));
app.get("/api/test", (req, res) => res.json({ message: "API is working successfully!" }));

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, role = "customer" } = req.body;
    if (!name || !email || !phone || !password || !["customer", "farmer"].includes(role)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) return res.status(409).json({ message: "Email already registered" });
    const { salt, hash } = hashPassword(password);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, hash, salt, role]
    );
    res.status(201).json({ id: result.insertId, name, email, phone, role });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role]);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: createToken(user.id), user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT p.id, p.name, p.category, p.emoji, p.quantity,
      p.price, p.location, p.sold_out AS soldOut, u.name AS farmer, p.farmer_id AS farmerId
      FROM products p JOIN users u ON u.id = p.farmer_id ORDER BY p.created_at DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Could not load products" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const farmer = await userFromRequest(req);
    const { name, category, emoji, quantity, price, location } = req.body;
    if (!farmer || farmer.role !== "farmer") return res.status(403).json({ message: "Farmer login required" });
    const [result] = await pool.query(
      "INSERT INTO products (farmer_id, name, category, emoji, quantity, price, location) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [farmer.id, name, category, emoji || "🥕", quantity, price, location]
    );
    res.status(201).json({ id: result.insertId, farmer: farmer.name, farmerId: farmer.id, name, category, emoji, quantity, price, location, soldOut: false });
  } catch (error) {
    res.status(500).json({ message: "Could not add product" });
  }
});

app.patch("/api/products/:id", async (req, res) => {
  try {
    const farmer = await userFromRequest(req);
    if (!farmer || farmer.role !== "farmer") return res.status(403).json({ message: "Farmer login required" });
    await pool.query("UPDATE products SET sold_out = ? WHERE id = ? AND farmer_id = ?", [Boolean(req.body.soldOut), req.params.id, farmer.id]);
    res.json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ message: "Could not update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const farmer = await userFromRequest(req);
    if (!farmer || farmer.role !== "farmer") return res.status(403).json({ message: "Farmer login required" });
    await pool.query("DELETE FROM products WHERE id = ? AND farmer_id = ?", [req.params.id, farmer.id]);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete product" });
  }
});

app.post("/api/orders", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const customer = await userFromRequest(req);
    const { name, phone, address, city, pincode, payment, products } = req.body;
    if (!customer || customer.role !== "customer") return res.status(401).json({ message: "Customer login required" });
    if (!products?.length) return res.status(400).json({ message: "Cart is empty" });
    const total = products.reduce((sum, item) => sum + Number(item.price) * Number(item.cartQuantity), 0);
    const orderCode = `ORD${Date.now()}`;
    await connection.beginTransaction();
    const [orderResult] = await connection.query(
      "INSERT INTO orders (order_code, customer_id, customer_name, phone, address, city, pincode, payment, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [orderCode, customer.id, name, phone, address, city, pincode, payment, total]
    );
    for (const item of products) {
      await connection.query(
        "INSERT INTO order_items (order_id, product_id, product_name, farmer, emoji, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [orderResult.insertId, item.id, item.name, item.farmer, item.emoji, item.price, item.cartQuantity]
      );
    }
    await connection.commit();
    res.status(201).json({ id: orderCode, total, status: "Order Placed" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Could not place order" });
  } finally {
    connection.release();
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const customer = await userFromRequest(req);
    if (!customer) return res.status(401).json({ message: "Login required" });
    const [orders] = await pool.query("SELECT order_code AS id, customer_name AS customer, phone, address, city, pincode, payment, total, status, DATE_FORMAT(created_at, '%d/%m/%Y') AS date FROM orders WHERE customer_id = ? ORDER BY created_at DESC", [customer.id]);
    for (const order of orders) {
      const [items] = await pool.query("SELECT product_id AS id, product_name AS name, farmer, emoji, price, quantity AS cartQuantity FROM order_items JOIN orders ON orders.id = order_items.order_id WHERE order_code = ?", [order.id]);
      order.products = items;
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load orders" });
  }
});

initializeDatabase()
  .then(() => app.listen(PORT, () => console.log(`FarmDirect Backend running on port ${PORT}`)))
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });