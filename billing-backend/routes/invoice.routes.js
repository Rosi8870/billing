const router = require("express").Router();
const controller = require("../controllers/invoice.controller");

router.post("/", controller.createInvoice);
router.get("/", controller.getInvoices);
router.get("/:id", controller.getInvoiceById);
router.get("/:id/pdf", controller.downloadInvoicePDF);

module.exports = router;
