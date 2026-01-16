require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

/* ---------- DB ---------- */
connectDB();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://billpro.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

/* ---------- ROUTES ---------- */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/invoices", require("./routes/invoice.routes"));
app.use("/api/reports", require("./routes/report.routes"));

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
