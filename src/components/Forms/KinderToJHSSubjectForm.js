import { FormikProvider, Form, useFormik } from 'formik';
import {
  InputField,
  MultipleComboBoxExample,
  MultiComboBox,
  RadioSelect,
  RadioSelectItem,
} from '../Inputs';
import { Button } from '../Buttons';
import { kinderToJHSSubjectSchema } from '@/lib/validators/subject-validator';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { PopupLoader } from '../Loaders';

export default function KinderSubjectForm({
  initialData,
  onCancel,
  onAfterSubmit = () => {},
  type = 'kinder',
}) {
  const [isLoading, setIsLoading] = useState(false);
  const subjectFormik = useFormik({
    initialValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      minutes: initialData?.minutes || 30,
      teachers: initialData?.teachers?.length ? initialData?.teachers : [],
      type,
    },
    onSubmit: handleSubmit,
    validationSchema: kinderToJHSSubjectSchema,
  });

  async function handleSubmit(values) {
    try {
      const newBody = {
        ...values,
        ...(initialData ? { _id: initialData?._id } : {}),
        teachers: values.teachers.map((teacher) => ({ teacher: teacher._id })),
      };
      console.log(newBody);
      setIsLoading(true);
      const res = await fetch('/api/pre-grade-school-subject', {
        method: initialData ? 'PATCH' : 'POST',
        body: JSON.stringify(newBody),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (result?.success) {
        toast.success(initialData ? 'Subject updated' : 'Subject added');
        onAfterSubmit();
      } else if (!result?.success && result?.error) {
        if (result?.error == 'SubjectCodeError') {
          subjectFormik.setFieldError('code', result?.errorMessage);
        } else {
          toast.error(`Can't ${initialData ? 'update' : 'add'} subject`);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(`Can't ${initialData ? 'update' : 'add'} subject`);
    }
  }
  return (
    <FormikProvider value={subjectFormik}>
      <PopupLoader
        message={`${initialData ? 'Updating' : 'Adding'} subject`}
        isOpen={isLoading}
      />
      <Form className="flex flex-col gap-6">
        <InputField
          type="text"
          name="code"
          label="Subject Code"
          placeholder="e.g. ENG"
        />
        <InputField
          type="text"
          name="name"
          label="Subject Name"
          placeholder="e.g. English"
        />
        <InputField
          type="number"
          name="minutes"
          label="Minutes"
          step={10}
          min={30}
          max={240}
        />
        <MultiComboBox
          label="Choose Teachers"
          placeholder="Enter teacher name..."
          searchUrl="/api/teachers/search"
          selectionType="teacher"
          name="teachers"
          infoMessage="You can add multiple teachers"
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
