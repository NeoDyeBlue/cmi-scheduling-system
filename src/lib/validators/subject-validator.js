import * as yup from 'yup';

export const subjectSchema = yup.object().shape({
  code: yup.string().required('Required'),
  name: yup.string().required('Required'),
  units: yup.number().min(1).max(4).required('Required'),
  semester: yup.number().min(1).max(2).required('Required'),
  teachers: yup
    .array()
    .nullable()
    .of(
      yup.object().shape({
        teacherId: yup.string().required('Teacher ID is required'),
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        type: yup
          .string()
          .oneOf(['part-time', 'full-time'])
          .required('Required'),
      })
    )
    .min(1, 'Add at least one teacher')
    .required('Required'),
});
