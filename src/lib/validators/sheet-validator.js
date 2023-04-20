import * as yup from 'yup';

export const sheetSchema = yup.object().shape({
  file: yup
    .mixed()
    .required('Please upload an Excel file')
    .test(
      'fileType',
      'Invalid file format. Only XLSX files are allowed.',
      (value) => {
        if (!value) return false; // Skip validation if file is not present
        return (
          value &&
          [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ].includes(value.type)
        );
      }
    ),
});
