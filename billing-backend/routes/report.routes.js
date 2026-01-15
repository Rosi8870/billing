const router = require("express").Router();
const report = require("../controllers/report.controller");

router.get("/daily", report.dailySales);
router.get("/monthly", report.monthlySales);
router.get("/top-products", report.topProducts);

module.exports = router;
