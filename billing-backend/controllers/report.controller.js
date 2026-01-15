const Invoice = require("../models/Invoice");

// DAILY SALES
exports.dailySales = async (req, res) => {
  const data = await Invoice.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        total: { $sum: "$grandTotal" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.json(data);
};

// MONTHLY SALES
exports.monthlySales = async (req, res) => {
  const data = await Invoice.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" }
        },
        total: { $sum: "$grandTotal" }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.json(data);
};

// TOP PRODUCTS
exports.topProducts = async (req, res) => {
  const data = await Invoice.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        qty: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.total" }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 }
  ]);
  res.json(data);
};
