import * as yup from 'yup';
import { differenceInHours, parse, isAfter } from 'date-fns';

function hasHourGap(startTime, endTime) {
  const start = parse(startTime, 'HH:mm', new Date());
  const end = parse(endTime, 'HH:mm', new Date());

  const hours = differenceInHours(end, start);

  return hours > 0;
}

function isAfterStartTime(startTime, endTime) {
  const start = parse(startTime, 'HH:mm', new Date());
  const end = parse(endTime, 'HH:mm', new Date());

  return isAfter(end, start);
}

export const teacherSchema = yup.object().shape({
  teacherId: yup
    .string()
    .matches(/^\d{2}-\d{4}$/, 'Please enter a valid format like ##-####')
    .required('Required'),
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  type: yup.string().oneOf(['part-time', 'full-time']).required('Required'),
  preferredDayTimes: yup
    .array()
    .nullable()
    .when('type', {
      is: (value) => value == 'part-time',
      then: () =>
        yup
          .array()
          .of(
            yup.object().shape({
              day: yup.number().min(1).max(7).required('Required'),
              start: yup
                .string()
                .required('Required')
                .test(
                  'is-after',
                  'Start time must be before end time',
                  function (value) {
                    const { parent } = this;
                    const endTime = parent.end;
                    return isAfterStartTime(value, endTime);
                  }
                )
                .test(
                  'is-valid',
                  'Start time must be at least 1 hour before end time',
                  function (value) {
                    const { parent } = this;
                    const endTime = parent.end;
                    return hasHourGap(value, endTime);
                  }
                ),
              end: yup
                .string()
                .required('Required')
                .test(
                  'is-after',
                  'End time must be after start time',
                  function (value) {
                    const { parent } = this;
                    const startTime = parent.start;
                    return isAfterStartTime(startTime, value);
                  }
                )
                .test(
                  'is-valid',
                  'End time must be at least 1 hour after start time',
                  function (value) {
                    const { parent } = this;
                    const startTime = parent.start;
                    return hasHourGap(startTime, value);
                  }
                ),
            })
          )
          .min(1, 'Select at least one option')
          .required('Required'),
      otherwise: () => yup.array().nullable().notRequired(),
    }),
  // preferredDayTimes: yup
  //   .array()
  //   .nullable()
  //   .of(
  //     yup.object().shape({
  //       day: yup.number().min(1).max(7).required('Required'),
  //       start: yup
  //         .string()
  //         .required('Required')
  //         .test(
  //           'is-after',
  //           'Start time must be before end time',
  //           function (value) {
  //             const { parent } = this;
  //             const endTime = parent.end;
  //             return isAfterStartTime(value, endTime);
  //           }
  //         )
  //         .test(
  //           'is-valid',
  //           'Start time must be at least 1 hour before end time',
  //           function (value) {
  //             const { parent } = this;
  //             const endTime = parent.end;
  //             return hasHourGap(value, endTime);
  //           }
  //         ),
  //       end: yup
  //         .string()
  //         .required('Required')
  //         .test(
  //           'is-after',
  //           'End time must be after start time',
  //           function (value) {
  //             const { parent } = this;
  //             const startTime = parent.start;
  //             return isAfterStartTime(startTime, value);
  //           }
  //         )
  //         .test(
  //           'is-valid',
  //           'End time must be at least 1 hour after start time',
  //           function (value) {
  //             const { parent } = this;
  //             const startTime = parent.start;
  //             return hasHourGap(startTime, value);
  //           }
  //         ),
  //     })
  //   )
  //   .min(1, 'Select at least one option')
  //   .required('Required'),
});
