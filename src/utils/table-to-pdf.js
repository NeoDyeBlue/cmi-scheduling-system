import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

export default function exportTableToPdf({
  filename = 'exported',
  tableId = '',
}) {
  // const doc = new jsPDF({
  //   orientation: 'landscape',
  // });

  const table = document.getElementById(tableId);

  // console.log(tableId);

  //   html2canvas(table).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdfWidth = doc.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //     // Add the canvas to the PDF document
  //     doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     doc.save(`${filename}.pdf`);
  //   });

  html2canvas(table, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape' });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, null);
    pdf.save(`${filename}.pdf`);
  });

  // doc.autoTable({ html: table });

  // doc.save(`${filename}.pdf`);

  // doc.html(table, {
  //   callback: function (doc) {
  //     doc.save();
  //   },
  //   x: 10,
  //   y: 10,
  // });
}
