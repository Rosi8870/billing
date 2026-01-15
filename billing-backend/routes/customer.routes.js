const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// ADD CUSTOMER
router.post("/", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL CUSTOMERS
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

module.exports = router;
