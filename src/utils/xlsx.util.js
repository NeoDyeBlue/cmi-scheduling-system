// const xlsx = require('xlsx');
import xlsx from 'xlsx';
import mongoose from 'mongoose';
export function convertExcelToJson(dataURI) {
  const [, base64String] = dataURI.split(',');
  //   const file = xlsx.readFile('teachers.xlsx');
  const buffer = Buffer.from(base64String, 'base64');

  // Parse the Excel file data into a JavaScript object
  const workbook = xlsx.read(buffer, { type: 'buffer' });

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  let json = xlsx.utils.sheet_to_json(worksheet);
  const data = json.map((d) => {
    Object.keys(d).forEach((key) => {
      const value = d[key];
      // Check if the value is not null, undefined or an empty string
      if (value !== null && value !== undefined && value !== '') {
        d[key] = value;
      }
    });
    d._id = new mongoose.Types.ObjectId();
    return d;
  });
  return data;
}
