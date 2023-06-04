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
      sectionsCount: initialData?.sections || 1,
      subjects: initialData?.subjects?.length
        ? _.sortBy(initialData?.subjects, ['code'])
        : [],
    },
    onSubmit: handleSubmit,
    validationSchema: levelSchema,
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
          levelFormik.setFieldError('code', result?.errorMessage);
        }
      } else {
        toast.error(`Can't ${initialData ? 'update' : 'add'} level`);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
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
        <InputField
          label="Section Count"
          name="sectionsCount"
          type="number"
          min={1}
          max={10}
        />
        <MultiComboBox
          label="Subjects"
          placeholder="Enter subject code or name"
          name="subjects"
          searchUrl="/api/subjects/search"
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
