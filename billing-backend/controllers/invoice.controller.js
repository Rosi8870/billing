const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const generateInvoicePDF = require("../utils/generateInvoicePDF");

// CREATE INVOICE
exports.createInvoice = async (req, res) => {
  try {
    const { customerId, items } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ msg: "Customer not found" });
    }

    let subTotal = 0;
    let gstTotal = 0;
    const finalItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({ msg: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ msg: `Insufficient stock for ${product.name}` });
      }

      const amount = product.price * item.quantity;
      const gst = (amount * product.gstPercent) / 100;
      const total = amount + gst;

      subTotal += amount;
      gstTotal += gst;

      product.stock -= item.quantity;
      await product.save();

      finalItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        gstPercent: product.gstPercent,
        total
      });
    }

    const invoice = new Invoice({
      invoiceNumber: "INV-" + Date.now(),
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        gstNumber: customer.gstNumber
      },
      items: finalItems,
      subTotal,
      gstTotal,
      grandTotal: subTotal + gstTotal
    });

    await invoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL INVOICES
exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  res.json(invoices);
};

// GET SINGLE INVOICE
exports.getInvoiceById = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return res.status(404).json({ msg: "Invoice not found" });
  }
  res.json(invoice);
};

// DOWNLOAD PDF (THIS IS THE IMPORTANT ONE)
exports.downloadInvoicePDF = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return res.status(404).json({ msg: "Invoice not found" });
  }

  generateInvoicePDF(invoice, res);
};
