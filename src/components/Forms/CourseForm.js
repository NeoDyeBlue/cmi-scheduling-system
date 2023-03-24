import { FormikProvider, Form, useFormik, FieldArray } from 'formik';
import { InputField } from '../Inputs';
import { Button, ActionButton } from '../Buttons';
import { RadioSelect, RadioSelectItem, MultiComboBox } from '../Inputs';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import { MdAdd, MdRemove } from 'react-icons/md';
import { courseSchema } from '@/lib/validators/course-validator';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { PopupLoader } from '../Loaders';

export default function CourseForm({
  initialData,
  onCancel,
  onAfterSubmit = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = resolveConfig(tailwindConfig);
  const courseFormik = useFormik({
    initialValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      type: initialData?.type || 'college',
      yearSections: initialData?.yearSections?.length
        ? initialData?.yearSections
        : [
            {
              year: 1,
              sectionCount: 1,
              semesterSubjects: [
                { semester: '1', subjects: [] },
                { semester: '2', subjects: [] },
              ],
            },
          ],
    },
    onSubmit: handleSubmit,
    validationSchema: courseSchema,
  });

  async function handleSubmit(values) {
    try {
      setIsLoading(true);
      const res = await fetch('/api/courses', {
        method: initialData ? 'PATCH' : 'POST',
        body: JSON.stringify({
          ...values,
          ...(initialData ? { _id: initialData?._id } : {}),
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (result?.success) {
        console.log(result);
        toast.success(`Course ${initialData ? 'updated' : 'added'}`);
        onAfterSubmit();
      } else if (!result?.success && result?.error) {
        if (result?.error == 'CourseCodeError') {
          courseFormik.setFieldError('code', result?.errorMessage);
        }
      } else {
        toast.error(`Can't ${initialData ? 'update' : 'add'} course`);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(`Can't ${initialData ? 'update' : 'add'} course`);
    }
  }
  return (
    <FormikProvider value={courseFormik}>
      <PopupLoader
        message={`${initialData ? 'Updating' : 'Adding'} course`}
        isOpen={isLoading}
      />
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
          <p className="font-display font-medium">
            Year, Sections Count, and Subjects
          </p>
          <div className="flex flex-col gap-2">
            <FieldArray name="yearSections">
              {({ insert, remove, push }) => (
                <div className="flex flex-col gap-5">
                  {courseFormik.values.yearSections.map((input, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className="flex  flex-col items-center justify-center rounded-lg bg-primary-100 p-2 
                            text-center font-medium leading-none text-primary-700"
                      >
                        <p className="text-xs">Year</p>
                        <p>{index + 1}</p>
                      </div>
                      <div className="flex w-full flex-col gap-2 rounded-md bg-gray-100 p-2">
                        <InputField
                          // label="Section count"
                          name={`yearSections[${index}].sectionCount`}
                          min={1}
                          key={index}
                          type="number"
                          placeholder="sections count"
                        />
                        <Tabs>
                          <TabList className="scrollbar-hide mb-2 flex w-full gap-2 overflow-x-auto">
                            <Tab
                              selectedClassName="bg-ship-gray-500 text-white hover:text-white hover:bg-ship-gray-500"
                              className="tab-sm"
                            >
                              1st sem
                            </Tab>
                            <Tab
                              selectedClassName="bg-ship-gray-500 text-white hover:text-white hover:bg-ship-gray-500"
                              className="tab-sm"
                            >
                              2nd sem
                            </Tab>
                          </TabList>
                          <TabPanel>
                            <MultiComboBox
                              placeholder="Enter subject code or name"
                              name={`yearSections[${index}].semesterSubjects[0].subjects`}
                              searchUrl="/api/subjects/search"
                              // label="Subjects"
                              filter={{
                                semester: 1,
                              }}
                            />
                          </TabPanel>
                          <TabPanel>
                            <MultiComboBox
                              placeholder="Enter subject code or name"
                              name={`yearSections[${index}].semesterSubjects[1].subjects`}
                              searchUrl="/api/subjects/search"
                              // label="Subjects"
                              filter={{
                                semester: 1,
                              }}
                            />
                          </TabPanel>
                        </Tabs>
                      </div>

                      <div className="flex w-[25px] flex-col gap-1 self-center">
                        <>
                          {index != 0 &&
                          index ==
                            courseFormik.values.yearSections.length - 1 ? (
                            <ActionButton
                              onClick={() => remove(index)}
                              icon={
                                <MdRemove size={16} className="text-white" />
                              }
                              buttonColor={theme.colors.primary[400]}
                            />
                          ) : null}
                          {courseFormik.values.yearSections.length <= 1 ||
                          (index ==
                            courseFormik.values.yearSections.length - 1 &&
                            courseFormik.values.yearSections.length < 6) ? (
                            <ActionButton
                              onClick={() =>
                                push({
                                  year:
                                    courseFormik.values.yearSections.length + 1,
                                  sectionCount: 1,
                                  semesterSubjects: [
                                    { semester: 1, subjects: [] },
                                    { semester: 2, subjects: [] },
                                  ],
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
            {courseFormik.errors.yearSections &&
              courseFormik.errors.yearSections &&
              typeof courseFormik.errors.yearSections == 'string' && (
                <p className="flex gap-1 text-sm text-danger-500">
                  {courseFormik.errors.yearSections}
                </p>
              )}
          </div>
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
