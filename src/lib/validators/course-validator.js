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
        sectionCount: yup
          .number()
          .min(1, 'Section count must be equal or greater than 1')
          .required('Required'),
        semesterSubjects: yup
          .array()
          .nullable()
          .of(
            yup.object().shape({
              semester: yup
                .string()
                .oneOf(['1', '2', 'summer'])
                .required('Semester name is required'),
              subjects: yup
                .array()
                .nullable()
                .of(
                  yup.object().shape({
                    _id: yup.string().required('_id is required'),
                    code: yup.string().required('code is required'),
                  })
                )
                // .min(1, 'Add atleast 1 subject')
                .required('Required'),
            })
          ),
      })
    )
    .min(1, 'Add at least one year and section')
    .test(
      'max-length',
      'Too many year sections for the selected type',
      function (value) {
        const max = this.parent.type == 'college' ? 6 : 2;
        return !value || value.length <= max;
      }
    )
    .required('Required'),
});

export const levelSchema = yup.object().shape({
  level: yup.number().min(1).max(10).required('Required'),
  type: yup.string().oneOf(['elementary', 'jhs']).required('Required'),
  // sectionCount: yup
  //   .number()
  //   .min(1, 'Section count must be equal or greater than 1')
  //   .required('Required'),
  sections: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .test('is-unique', 'Section names must be unique', function (value) {
          const array = this.from[0].value.sections;
          const { path, createError } = this;
          const isUnique = array.filter((item) => item === value).length === 1;
          return isUnique ? true : createError({ path });
        })
        .required('Required')
    )
    // .test('is-unique', 'Section names must be unique', function (values) {
    //   if (!values || !Array.isArray(values)) {
    //     return false;
    //   }
    //   const uniqueValues = new Set(values);
    //   return uniqueValues.size === values.length;
    // })
    // .test('is-not-empty', 'Sections cannot be empty', function (values) {
    //   if (!values || !Array.isArray(values)) {
    //     return false;
    //   }
    //   return values.every((value) => value.trim().length > 0);
    // })
    .min(1, 'Sections cannot be empty'),
  subjects: yup
    .array()
    .nullable()
    .of(
      yup.object().shape({
        _id: yup.string().required('_id is required'),
        code: yup.string().required('code is required'),
      })
    )
    .min(1, 'Add atleast 1 subject')
    .required('Required'),
});
