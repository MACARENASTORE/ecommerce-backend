// src/utils/invoiceGenerator.js
const PDFDocument = require('pdfkit');

/**
 * Genera un buffer PDF de la factura para el pedido.
 * @param {Object} order - Orden con detalles para la factura.
 * @returns {Buffer} Buffer del PDF generado.
 */
async function generateInvoicePDFBuffer(order) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        let buffers = [];

        // Recoger datos del buffer
        doc.on('data', data => buffers.push(data));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Información de la empresa
        const companyInfo = {
            name: "MacarenaStore",
            address: "Calle 67b 65-13, Bogotá, Colombia",
            contact: "Tel: 3106469827 | Email: macarenastore046@gmail.com",
            logoPath: "src/assets/Logo.jpg"
        };

        // Encabezado de la empresa
        if (companyInfo.logoPath) {
            doc.image(companyInfo.logoPath, 50, 45, { width: 50 });
        }
        doc.fontSize(20).text(companyInfo.name, 110, 50);
        doc.fontSize(10).text(companyInfo.address, 110, 70);
        doc.text(companyInfo.contact, 110, 85);
        doc.moveDown();

        // Información de la factura
        doc.fontSize(16).text("Factura", { align: "right" });
        doc.fontSize(10).text(`Factura N°: ${order._id}`, { align: "right" });
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, { align: "right" });
        doc.moveDown();

        // Información del cliente
        doc.fontSize(12).text("Facturado a:");
        doc.fontSize(10).text(order.userId.name || "Cliente Genérico");
        doc.text(`Dirección: ${order.userId.address || "Sin dirección"}`);
        doc.text(`Teléfono: ${order.userId.phone || "Sin teléfono"}`);
        doc.moveDown();

        // Línea divisoria
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

        // Tabla de productos
        const tableTop = doc.y + 20;
        const itemSpacing = 20;

        doc.fontSize(12).text("Productos:", 50, tableTop);
        doc.fontSize(10);
        doc.text("Producto", 50, tableTop + itemSpacing);
        doc.text("Cantidad", 250, tableTop + itemSpacing);
        doc.text("Precio Unitario", 350, tableTop + itemSpacing);
        doc.text("Total", 450, tableTop + itemSpacing);

        doc.moveTo(50, tableTop + itemSpacing + 15).lineTo(550, tableTop + itemSpacing + 15).stroke();

        let position = tableTop + itemSpacing + 30;
        order.products.forEach(item => {
            doc.text(item.productId?.name || "Producto desconocido", 50, position); // Muestra el nombre del producto
            doc.text(item.quantity, 250, position);
            doc.text(`$${item.price.toFixed(2)}`, 350, position);
            doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 450, position);
            position += 20;
        });

        // Línea divisoria
        doc.moveTo(50, position + 10).lineTo(550, position + 10).stroke();

        // Total de la factura
        doc.fontSize(12).text("Total:", 400, position + 20);
        doc.fontSize(12).text(`$${order.totalAmount.toFixed(2)}`, 450, position + 20);

        // Finalizar el documento
        doc.end();
    });
}

module.exports = { generateInvoicePDFBuffer };
