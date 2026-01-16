const PDFDocument = require("pdfkit");

module.exports = function generateInvoicePDF(invoice, res) {
  const doc = new PDFDocument({ size: "A4", margin: 40 });

  /* ---------------- RESPONSE ---------------- */
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice-${invoice.invoiceNumber}.pdf`
  );

  doc.pipe(res);

  /* ---------------- HELPERS ---------------- */
  const drawLine = (y) => {
    doc
      .strokeColor("#cccccc")
      .lineWidth(1)
      .moveTo(40, y)
      .lineTo(555, y)
      .stroke();
  };

  const currency = (v) => `₹${Number(v).toFixed(2)}`;

  /* ---------------- HEADER ---------------- */
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Sojan's BillPro", 40, 40);

  doc
    .font("Helvetica")
    .fontSize(9)
    .text("Nagercoil, Tamil Nadu, India")
    .text("GSTIN: 29ABCDE1234F1Z5");

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .text("TAX INVOICE", 400, 40, { align: "right" });

  doc
    .font("Helvetica")
    .fontSize(9)
    .text(`Invoice No: ${invoice.invoiceNumber}`, 400, 65, { align: "right" })
    .text(
      `Date: ${new Date(invoice.createdAt).toLocaleDateString()}`,
      400,
      80,
      { align: "right" }
    );

  drawLine(110);

  /* ---------------- BILL TO ---------------- */
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Bill To", 40, 125);

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(invoice.customer.name, 40, 140);

  if (invoice.customer.gstNumber) {
    doc.text(`GSTIN: ${invoice.customer.gstNumber}`, 40, 155);
  }

  /* ---------------- TABLE HEADER ---------------- */
  let tableY = 190;

  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("Item", 40, tableY);
  doc.text("Qty", 260, tableY, { width: 40, align: "right" });
  doc.text("Rate", 310, tableY, { width: 70, align: "right" });
  doc.text("GST %", 390, tableY, { width: 50, align: "right" });
  doc.text("Amount", 450, tableY, { width: 90, align: "right" });

  drawLine(tableY + 15);

  /* ---------------- TABLE ROWS ---------------- */
  doc.font("Helvetica").fontSize(10);

  let rowY = tableY + 25;
  const rowHeight = 20;

  invoice.items.forEach((item) => {
    doc.text(item.name, 40, rowY, { width: 200 });
    doc.text(item.quantity, 260, rowY, { width: 40, align: "right" });
    doc.text(currency(item.price), 310, rowY, { width: 70, align: "right" });
    doc.text(`${item.gstPercent}%`, 390, rowY, { width: 50, align: "right" });
    doc.text(currency(item.total), 450, rowY, { width: 90, align: "right" });

    rowY += rowHeight;
  });

  drawLine(rowY);

  /* ---------------- TOTALS ---------------- */
  const totalsY = rowY + 20;
  const totalsX = 350;

  doc.font("Helvetica").fontSize(10);

  doc.text("Subtotal", totalsX, totalsY);
  doc.text(currency(invoice.subTotal), totalsX + 120, totalsY, {
    align: "right",
  });

  doc.text("GST", totalsX, totalsY + 15);
  doc.text(currency(invoice.gstTotal), totalsX + 120, totalsY + 15, {
    align: "right",
  });

  drawLine(totalsY + 35);

  doc.font("Helvetica-Bold").fontSize(12);
  doc.text("Grand Total", totalsX, totalsY + 45);
  doc.text(currency(invoice.grandTotal), totalsX + 120, totalsY + 45, {
    align: "right",
  });

  /* ---------------- FOOTER ---------------- */
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#666666")
    .text(
      "This is a computer-generated invoice. No signature required.",
      40,
      780,
      { align: "center", width: 515 }
    );

  doc.end();
};
