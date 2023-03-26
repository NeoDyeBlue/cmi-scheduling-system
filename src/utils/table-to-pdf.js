import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function exportTableToPdf({
  filename = 'exported',
  tableId = '',
}) {
  const doc = new jsPDF({
    orientation: 'landscape',
  });

  const table = document.getElementById(tableId);

  console.log(tableId);

  //   html2canvas(table).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdfWidth = doc.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //     // Add the canvas to the PDF document
  //     doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     doc.save(`${filename}.pdf`);
  //   });

  doc.html(table).then(() => {
    doc.save(`${filename}.pdf`);
  });
}
