require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/invoices", require("./routes/invoice.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
app.use("/api/reports", require("./routes/report.routes"));
app.use("/api/auth", require("./routes/auth.routes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
