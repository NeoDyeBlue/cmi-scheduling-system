import { FormikProvider, Form, useFormik, FieldArray } from 'formik';
import {
  InputField,
  MultiSelect,
  MultiSelectItem,
  ImagePicker,
  RadioSelect,
  RadioSelectItem,
} from '../Inputs';
import { Button } from '../Buttons';
import classNames from 'classnames';
import { teacherSchema } from '@/lib/validators/teacher-validator';
import { toast } from 'react-hot-toast';

export default function TeacherForm({
  initialData,
  onCancel,
  onAfterSubmit = () => {},
}) {
  const teacherFormik = useFormik({
    initialValues: {
      teacherId: initialData?.teacherId || '',
      image: initialData?.image || '',
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      type: initialData?.type || 'part-time',
      preferredDayTimes: initialData?.preferredDays.length
        ? initialData?.preferredDays
        : [],
    },
    onSubmit: handleSubmit,
    validationSchema: teacherSchema,
  });
  console.log(initialData.image);
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  async function handleSubmit(values) {
    try {
      const res = await fetch('/api/teachers', {
        method: initialData ? 'PATCH' : 'POST',
        body: JSON.stringify({
          ...values,
          ...(initialData ? { _id: initialData?._id } : {}),
          preferredDayTimes:
            values.type == 'part-time' ? values.preferredDayTimes : [],
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json();
      if (result && result.success) {
        toast.success(initialData ? 'Teacher updated' : 'Teacher Added');
        onAfterSubmit();
      }
      console.log(result);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  }
  return (
    <FormikProvider value={teacherFormik}>
      <Form className="flex flex-col gap-6">
        <ImagePicker
          name="image"
          label="Teacher Picture"
          infoMessage="File should be in '.jpg' or '.png', max file size is 5mb"
        />
        <InputField
          type="text"
          name="teacherId"
          label="Teacher ID"
          placeholder="e.g. 11-1111"
        />
        <InputField type="text" name="firstName" label="First Name" />
        <InputField type="text" name="lastName" label="Last Name" />
        <RadioSelect
          label="Type"
          error={
            teacherFormik.errors.type && teacherFormik.touched.type
              ? teacherFormik.errors.type
              : null
          }
        >
          <RadioSelectItem
            name="type"
            value="part-time"
            checked={teacherFormik.values.type == 'part-time'}
          >
            Part-time
          </RadioSelectItem>
          <RadioSelectItem
            name="type"
            value="full-time"
            checked={teacherFormik.values.type == 'full-time'}
          >
            Full-time
          </RadioSelectItem>
        </RadioSelect>
        {teacherFormik.values.type == 'part-time' ? (
          <FieldArray name="preferredDayTimes">
            {({ push, remove }) => (
              <MultiSelect
                label="Preferred Day Times"
                infoMessage="You can select more than one"
                name="preferredDayTimes"
                error={
                  teacherFormik.errors.preferredDayTimes &&
                  teacherFormik.touched.preferredDayTimes &&
                  typeof teacherFormik.errors.preferredDayTimes == 'string'
                    ? teacherFormik.errors.preferredDayTimes
                    : null
                }
              >
                {daysOfWeek.map((day, index) => {
                  const isChecked = teacherFormik.values.preferredDayTimes.some(
                    (dayTime) => dayTime.day == index + 1
                  );

                  console.log(isChecked);

                  return (
                    <MultiSelectItem
                      key={day}
                      name="preferredDayTimes"
                      checked={isChecked}
                      // value={index + 1}
                      onChange={(e) => {
                        if (e.target.checked) {
                          push({ day: index + 1, start: '', end: '' });
                        } else {
                          const selectionIndex =
                            teacherFormik.values.preferredDayTimes.findIndex(
                              (dayTime) => dayTime.day == index + 1
                            );
                          remove(selectionIndex);
                        }
                      }}
                    >
                      <div
                        className={classNames(
                          'flex w-full flex-col gap-2 rounded-md border p-3',
                          {
                            'border-gray-100 bg-gray-100': isChecked,
                            'border-gray-200': !isChecked,
                          }
                        )}
                      >
                        <p>{day}</p>
                        <div className="flex w-full gap-2">
                          <InputField
                            disabled={!isChecked}
                            type="time"
                            name={`preferredDayTimes[${teacherFormik.values.preferredDayTimes.findIndex(
                              (dayTime) => dayTime.day == index + 1
                            )}].start`}
                            label="Time Start"
                            value={
                              teacherFormik.values.preferredDayTimes.find(
                                (dayTime) => dayTime.day == index + 1
                              )?.start || ''
                            }
                          />
                          <InputField
                            disabled={!isChecked}
                            type="time"
                            name={`preferredDayTimes[${teacherFormik.values.preferredDayTimes.findIndex(
                              (dayTime) => dayTime.day == index + 1
                            )}].end`}
                            label="Time End"
                            value={
                              teacherFormik.values.preferredDayTimes.find(
                                (dayTime) => dayTime.day == index + 1
                              )?.end || ''
                            }
                          />
                        </div>
                      </div>
                    </MultiSelectItem>
                  );
                })}
              </MultiSelect>
            )}
          </FieldArray>
        ) : null}
        <div className="mb-1 flex gap-2">
          {onCancel && (
            <Button fullWidth type="button" onClick={onCancel} secondary>
              Cancel
            </Button>
          )}
          <Button fullWidth type="submit">
            Done
          </Button>
        </div>
      </Form>
    </FormikProvider>
  );
}
