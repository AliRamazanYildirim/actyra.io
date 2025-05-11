import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateTicketPdf({ name, eventTitle, orderNumber }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 300]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  page.drawText(`Ticket für: ${eventTitle}`, {
    x: 40,
    y: height - 40,
    size: 16,
    font,
    color: rgb(0.2, 0.2, 0.8),
  });

  page.drawText(`Name: ${name}`, { x: 40, y: height - 80, size: 12, font });
  page.drawText(`Bestellnummer: ${orderNumber}`, { x: 40, y: height - 110, size: 12, font });

  page.drawText('Danke für deine Buchung!', {
    x: 40,
    y: height - 160,
    size: 12,
    font,
    color: rgb(0, 0.5, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `ticket-${orderNumber}.pdf`;
  a.click();
}
