// src/utils/invoiceGenerator.js
const PDFDocument = require('pdfkit');

/**
 * Genera un buffer PDF de la factura para el pedido.
 * @param {Object} order - Orden con detalles para la factura.
 * @returns {Buffer} Buffer del PDF generado.
 */
async function generateInvoicePDFBuffer(order) {
    // Verificar datos de la orden
    if (!order || !order.userId || !order.products) {
        console.error("Error: La orden, el usuario o los productos no están definidos correctamente.");
        throw new Error('La orden o los productos no están definidos correctamente.');
    }

    console.log("Generando factura para orden:", order._id);
    console.log("Información del cliente:", order.userId);
    order.products.forEach((item, index) => {
        console.log(`Producto ${index + 1}:`, item.productId);
    });

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
        const clientInfo = order.userId;
        console.log("Información del cliente:", clientInfo); // Verificar contenido del cliente
        doc.fontSize(12).text("Facturado a:");
        doc.fontSize(10).text(clientInfo.username || "Cliente Genérico");
        doc.text(`Correo: ${clientInfo.email || "No especificado"}`);
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
        order.products.forEach((item, index) => {
            console.log(`Producto ${index + 1}:`, item.productId); // Verificar contenido del producto
            doc.text(item.productId?.name || "Producto desconocido", 50, position);
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
