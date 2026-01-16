const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

module.exports = async function generateInvoicePdf(invoice, res) {
  const templatePath = path.join(__dirname, "../templates/invoice.html");
  let html = fs.readFileSync(templatePath, "utf8");

  const itemsHtml = invoice.items.map(i => `
    <tr>
      <td>${i.name}</td>
      <td class="right">${i.quantity}</td>
      <td class="right">₹${i.price}</td>
      <td class="right">${i.gstPercent}%</td>
      <td class="right">₹${i.total}</td>
    </tr>
  `).join("");

  html = html
    .replace("{{invoiceNumber}}", invoice.invoiceNumber)
    .replace("{{date}}", new Date(invoice.createdAt).toLocaleDateString())
    .replace("{{customerName}}", invoice.customer.name)
    .replace("{{customerGST}}", invoice.customer.gstNumber || "")
    .replace("{{items}}", itemsHtml)
    .replace("{{subtotal}}", invoice.subTotal)
    .replace("{{gst}}", invoice.gstTotal)
    .replace("{{grand}}", invoice.grandTotal);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=invoice.pdf");
  res.send(pdf);
};
