import { FormikProvider, Form, useFormik, FieldArray } from 'formik';
import { InputField } from '../Inputs';
import { Button, ActionButton } from '../Buttons';
import { RadioSelect, RadioSelectItem, MultiComboBox } from '../Inputs';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import { MdAdd, MdRemove } from 'react-icons/md';
import { levelSchema } from '@/lib/validators/course-validator';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { PopupLoader } from '../Loaders';
import _ from 'lodash';

export default function GradeLevelForm({
  level = 1,
  initialData,
  onCancel,
  onAfterSubmit = () => {},
  type = 'elementary',
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = resolveConfig(tailwindConfig);

  const levelFormik = useFormik({
    initialValues: {
      level,
      type,
      sections: initialData?.sections || [''],
      subjects: initialData?.subjects?.length
        ? _.sortBy(initialData?.subjects, ['code'])
        : [],
    },
    onSubmit: handleSubmit,
    validationSchema: levelSchema,
  });

  async function handleSubmit(values) {
    // console.log(values);
    try {
      setIsLoading(true);
      const res = await fetch('/api/grade-school', {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          ...(initialData ? { _id: initialData?._id } : {}),
          subjects: values.subjects.map((subject) => ({
            subject: subject._id,
          })),
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (result?.success) {
        toast.success(`Course ${initialData ? 'updated' : 'added'}`);
        onAfterSubmit();
      } else if (!result?.success && result?.error) {
        if (result?.error == 'SectionNameError') {
          levelFormik.setFieldError('sections', result?.errorMessage);
        }
      } else {
        toast.error(`Can't ${initialData ? 'update' : 'add'} level`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(`Can't ${initialData ? 'update' : 'add'} level`);
    }
  }
  return (
    <FormikProvider value={levelFormik}>
      <PopupLoader
        message={`${initialData ? 'Updating' : 'Adding'} level`}
        isOpen={isLoading}
      />
      <Form className="flex flex-col gap-6">
        <p className="font-display text-3xl font-bold text-primary-500">
          Grade {level}
        </p>
        {/* <InputField
          label="Section Count"
          name="sectionsCount"
          type="number"
          min={1}
          max={10}
        /> */}
        <div className="flex flex-col gap-2">
          <p className="font-display font-medium">Sections</p>
          <div className="flex flex-col gap-2">
            <FieldArray name="sections">
              {({ insert, remove, push }) => (
                <div className="flex flex-col gap-5">
                  {levelFormik.values.sections.map((input, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className="flex  flex-col items-center justify-center rounded-lg bg-primary-100 p-2 
                            text-center font-medium leading-none text-primary-700"
                      >
                        <p>{index + 1}</p>
                      </div>
                      <div className="flex w-full flex-col gap-2 rounded-md bg-gray-100 p-2">
                        <InputField
                          // label="Section count"
                          name={`sections[${index}]`}
                          placeholder="Section Name"
                        />
                      </div>

                      <div className="flex w-[25px] flex-col gap-1 self-center">
                        <>
                          {levelFormik.values.sections.length > 1 ? (
                            <ActionButton
                              onClick={() => remove(index)}
                              icon={
                                <MdRemove size={16} className="text-white" />
                              }
                              buttonColor={theme.colors.primary[400]}
                            />
                          ) : null}
                          {levelFormik.values.sections.length <= 1 ||
                          index == levelFormik.values.sections.length - 1 ? (
                            <ActionButton
                              onClick={() => push('')}
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
            {levelFormik.errors.sections &&
              levelFormik.errors.sections &&
              typeof levelFormik.errors.sections == 'string' && (
                <p className="flex gap-1 text-sm text-danger-500">
                  {levelFormik.errors.sections}
                </p>
              )}
          </div>
        </div>
        <MultiComboBox
          label="Subjects"
          placeholder="Enter subject code or name"
          name="subjects"
          searchUrl="/api/pre-grade-school-subject"
          // label="Subjects"
          filter={{
            type,
          }}
        />
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
