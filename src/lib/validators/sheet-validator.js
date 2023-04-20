import * as yup from 'yup';

export const sheetSchema = yup.object().shape({
  file: yup
    .mixed()
    .test(
      'fileType',
      'Invalid file format. Only XLSX files are allowed.',
      (value) => {
        if (!value) return false; // Skip validation if value is not present
        if (typeof value !== 'string' || !value.startsWith('data:'))
          return false; // Check if value is a valid data URL
        const mimeType = value.split(';')[0].split(':')[1]; // Extract the mime type from the data URL
        return (
          mimeType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ); // Check if the mime type is valid
      }
    )
    .required('Please upload an Excel file'),
});
