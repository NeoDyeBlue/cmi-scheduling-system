import * as yup from 'yup';

export const subjectSchema = yup.object().shape({
  code: yup.string().required('Required'),
  name: yup.string().required('Required'),
  units: yup.number().min(1).max(4).required('Required'),
  semester: yup.number().min(1).max(2).required('Required'),
  type: yup.string().oneOf(['college', 'shs']).required('Required'),
  teachers: yup
    .array()
    .nullable()
    .of(
      yup.object().shape({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        type: yup
          .string()
          .oneOf(['part-time', 'full-time'])
          .required('Required'),
      })
    ),
});

export const kinderToJHSSubjectSchema = yup.object().shape({
  code: yup.string().required('Required'),
  name: yup.string().required('Required'),
  minutes: yup.number().min(30).max(240).required('Required'),
  type: yup
    .string()
    .oneOf(['kinder', 'elementary', 'jhs'])
    .required('Required'),
  teachers: yup
    .array()
    .nullable()
    .of(
      yup.object().shape({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        type: yup
          .string()
          .oneOf(['part-time', 'full-time'])
          .required('Required'),
      })
    ),
});
