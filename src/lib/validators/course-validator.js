import * as yup from 'yup';

export const courseSchema = yup.object().shape({
  code: yup.string().required('Required'),
  name: yup.string().required('Required'),
  type: yup.string().oneOf(['college', 'shs']).required('Required'),
  yearSections: yup
    .array()
    .nullable()
    .of(
      yup.object().shape({
        year: yup.number().required('Required'),
        sections: yup.number().min(1).required('Required'),
      })
    )
    .min(1, 'Add at least one year and section')
    .required('Required'),
});
