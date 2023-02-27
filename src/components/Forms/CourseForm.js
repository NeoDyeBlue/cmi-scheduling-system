import { FormikProvider, Form, useFormik, FieldArray } from 'formik';
import { InputField } from '../Inputs';
import { Button, ActionButton } from '../Buttons';
import { RadioSelect, RadioSelectItem } from '../Inputs';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import { MdAdd, MdRemove } from 'react-icons/md';
import { courseSchema } from '@/lib/validators/course-validator';
import { toast } from 'react-hot-toast';

export default function CourseForm({ initialData, onCancel }) {
  const { theme } = resolveConfig(tailwindConfig);
  const courseFormik = useFormik({
    initialValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      type: initialData?.type || 'college',
      yearSections: initialData?.yearSections || [{ year: 1, sectionCount: 1 }],
    },
    onSubmit: handleSubmit,
    validationSchema: courseSchema,
  });

  async function handleSubmit(values) {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (result?.success) {
        console.log(result);
        toast.success('Course Added');
      } else if (!result?.success && result?.error) {
        if (result?.error == 'CourseCodeError') {
          courseFormik.setFieldError('code', result?.errorMessage);
        }
      } else {
        toast.error("Can't add course");
      }
    } catch (error) {
      console.log(error);
      toast.error("Can't add course");
    }
  }
  return (
    <FormikProvider value={courseFormik}>
      <Form className="flex flex-col gap-6">
        <InputField
          type="text"
          name="code"
          label="Course Code"
          placeholder="e.g. BSCS"
        />
        <InputField
          type="text"
          name="name"
          label="Course Name"
          placeholder="e.g. Bachelor of Science in Computer Science"
        />
        <RadioSelect
          label="Type"
          error={
            courseFormik.errors.type && courseFormik.touched.type
              ? courseFormik.errors.type
              : null
          }
        >
          <RadioSelectItem
            name="type"
            value="college"
            checked={courseFormik.values.type == 'college'}
          >
            College
          </RadioSelectItem>
          <RadioSelectItem
            name="type"
            value="shs"
            checked={courseFormik.values.type == 'shs'}
          >
            Senior High
          </RadioSelectItem>
        </RadioSelect>
        <div className="flex flex-col gap-2">
          <p className="font-display font-medium">Year & Sections Count</p>
          <FieldArray name="yearSections">
            {({ insert, remove, push }) => (
              <div className="flex flex-col gap-2">
                {courseFormik.values.yearSections.map((input, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <p
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-primary-100 p-3 
                            text-center font-medium leading-none text-primary-700"
                    >
                      {index + 1}
                    </p>
                    <InputField
                      name={`yearSections[${index}].sectionCount`}
                      min={1}
                      key={index}
                      type="number"
                      placeholder="sections count"
                    />

                    <div className="flex w-[25px] flex-col gap-1">
                      <>
                        {index != 0 &&
                        index == courseFormik.values.yearSections.length - 1 ? (
                          <ActionButton
                            onClick={() => remove(index)}
                            icon={<MdRemove size={16} className="text-white" />}
                            buttonColor={theme.colors.primary[400]}
                          />
                        ) : null}
                        {courseFormik.values.yearSections.length <= 1 ||
                        index == courseFormik.values.yearSections.length - 1 ? (
                          <ActionButton
                            onClick={() =>
                              push({
                                year:
                                  courseFormik.values.yearSections.length + 1,
                                sectionCount: 1,
                              })
                            }
                            icon={<MdAdd size={16} className="text-white" />}
                            buttonColor={theme.colors.primary[400]}
                          />
                        ) : null}
                      </>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FieldArray>
        </div>
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
