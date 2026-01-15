const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  customer: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    phone: String,
    gstNumber: String
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      gstPercent: Number,
      total: Number
    }
  ],
  subTotal: Number,
  gstTotal: Number,
  grandTotal: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Invoice", invoiceSchema);
