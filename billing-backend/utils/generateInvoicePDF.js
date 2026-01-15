const PDFDocument = require("pdfkit");

module.exports = function generateInvoicePDF(invoice, res) {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=${invoice.invoiceNumber}.pdf`
  );

  doc.pipe(res);

  /* -------- HEADER -------- */
  doc.fontSize(20).text("TAX INVOICE", { align: "center" });
  doc.moveDown();

  doc.fontSize(10);
  doc.text("Your Company Name");
  doc.text("Address Line, City, State");
  doc.text("GSTIN: 29ABCDE1234F1Z5");
  doc.moveDown();

  /* -------- INVOICE INFO -------- */
  doc.text(`Invoice No: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  /* -------- CUSTOMER -------- */
  doc.text("Bill To:", { underline: true });
  doc.text(invoice.customer.name);
  if (invoice.customer.gstNumber)
    doc.text(`GSTIN: ${invoice.customer.gstNumber}`);
  doc.moveDown();

  /* -------- TABLE HEADER -------- */
  doc.fontSize(10);
  doc.text("Product", 40, doc.y, { width: 150 });
  doc.text("Qty", 200, doc.y);
  doc.text("Rate", 240, doc.y);
  doc.text("GST%", 300, doc.y);
  doc.text("Total", 360, doc.y);
  doc.moveDown();

  doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  /* -------- ITEMS -------- */
  invoice.items.forEach((item) => {
    doc.text(item.name, 40, doc.y, { width: 150 });
    doc.text(item.quantity, 200, doc.y);
    doc.text(`₹${item.price}`, 240, doc.y);
    doc.text(`${item.gstPercent}%`, 300, doc.y);
    doc.text(`₹${item.total}`, 360, doc.y);
    doc.moveDown();
  });

  doc.moveDown();
  doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  /* -------- TOTALS -------- */
  doc.text(`Sub Total: ₹${invoice.subTotal}`, { align: "right" });
  doc.text(`GST: ₹${invoice.gstTotal}`, { align: "right" });
  doc.fontSize(12).text(
    `Grand Total: ₹${invoice.grandTotal}`,
    { align: "right" }
  );

  doc.moveDown(2);

  /* -------- FOOTER -------- */
  doc.fontSize(9).text(
    "This is a computer generated invoice.",
    { align: "center" }
  );

  doc.end();
};
