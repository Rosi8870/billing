const PDFDocument = require("pdfkit");

module.exports = function generateInvoicePDF(invoice, res) {
  const doc = new PDFDocument({ size: "A4", margin: 40 });

  /* ---------- RESPONSE HEADERS ---------- */
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice-${invoice.invoiceNumber}.pdf`
  );

  doc.pipe(res);

  /* ---------- HELPERS ---------- */
  const drawLine = () => {
    doc
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .moveTo(40, doc.y)
      .lineTo(555, doc.y)
      .stroke();
  };

  /* ---------- HEADER ---------- */
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("TAX INVOICE", { align: "right" });

  doc.moveDown(0.5);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Your Company Name", 40, 40)
    .text("Address Line, City, State")
    .text("GSTIN: 29ABCDE1234F1Z5");

  doc
    .fontSize(10)
    .text(`Invoice No: ${invoice.invoiceNumber}`, 380, 70)
    .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 380, 85);

  doc.moveDown(2);
  drawLine();
  doc.moveDown();

  /* ---------- BILL TO ---------- */
  doc.font("Helvetica-Bold").text("Bill To");
  doc.font("Helvetica").text(invoice.customer.name);

  if (invoice.customer.gstNumber) {
    doc.text(`GSTIN: ${invoice.customer.gstNumber}`);
  }

  doc.moveDown(1.5);

  /* ---------- TABLE HEADER ---------- */
  const tableTop = doc.y;

  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("Item", 40, tableTop, { width: 180 });
  doc.text("Qty", 230, tableTop, { width: 50, align: "right" });
  doc.text("Rate", 290, tableTop, { width: 70, align: "right" });
  doc.text("GST %", 370, tableTop, { width: 60, align: "right" });
  doc.text("Amount", 440, tableTop, { width: 100, align: "right" });

  doc.moveDown(0.5);
  drawLine();
  doc.moveDown(0.5);

  /* ---------- TABLE ROWS ---------- */
  doc.font("Helvetica").fontSize(10);

  invoice.items.forEach((item) => {
    const y = doc.y;

    doc.text(item.name, 40, y, { width: 180 });
    doc.text(item.quantity, 230, y, { width: 50, align: "right" });
    doc.text(`₹${item.price}`, 290, y, { width: 70, align: "right" });
    doc.text(`${item.gstPercent}%`, 370, y, { width: 60, align: "right" });
    doc.text(`₹${item.total}`, 440, y, { width: 100, align: "right" });

    doc.moveDown();
  });

  doc.moveDown(0.5);
  drawLine();
  doc.moveDown(1);

  /* ---------- TOTALS BOX ---------- */
  const totalsX = 340;

  doc.font("Helvetica").fontSize(10);
  doc.text("Subtotal:", totalsX, doc.y, { width: 100 });
  doc.text(`₹${invoice.subTotal}`, totalsX + 120, doc.y, {
    width: 100,
    align: "right",
  });

  doc.moveDown(0.5);
  doc.text("GST:", totalsX, doc.y, { width: 100 });
  doc.text(`₹${invoice.gstTotal}`, totalsX + 120, doc.y, {
    width: 100,
    align: "right",
  });

  doc.moveDown(0.5);
  drawLine();

  doc.font("Helvetica-Bold").fontSize(12);
  doc.text("Grand Total:", totalsX, doc.y + 5, { width: 120 });
  doc.text(`₹${invoice.grandTotal}`, totalsX + 120, doc.y + 5, {
    width: 100,
    align: "right",
  });

  doc.moveDown(3);

  /* ---------- FOOTER ---------- */
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#6b7280")
    .text(
      "This is a computer-generated invoice. No signature required.",
      40,
      780,
      { align: "center", width: 515 }
    );

  doc.end();
};
