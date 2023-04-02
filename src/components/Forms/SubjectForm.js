import { FormikProvider, Form, useFormik } from 'formik';
import {
  InputField,
  MultipleComboBoxExample,
  MultiComboBox,
  RadioSelect,
  RadioSelectItem,
} from '../Inputs';
import { Button } from '../Buttons';
import { subjectSchema } from '@/lib/validators/subject-validator';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { PopupLoader } from '../Loaders';

export default function SubjectForm({
  initialData,
  onCancel,
  onAfterSubmit = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false);
  const subjectFormik = useFormik({
    initialValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      units: initialData?.units || 1,
      teachers: initialData?.assignedTeachers?.length
        ? initialData?.assignedTeachers
        : [],
      semester: initialData?.semester || 1,
      type: initialData?.type || 'college',
    },
    onSubmit: handleSubmit,
    validationSchema: subjectSchema,
  });

  async function handleSubmit(values) {
    try {
      setIsLoading(true);
      const res = await fetch('/api/subjects', {
        method: initialData ? 'PATCH' : 'POST',
        body: JSON.stringify({
          ...values,
          ...(initialData ? { _id: initialData?._id } : {}),
        }),
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
          placeholder="e.g. APPSDEV"
        />
        <InputField
          type="text"
          name="name"
          label="Subject Name"
          placeholder="e.g. Applications Development"
        />
        <InputField type="number" name="units" label="Units" />
        <RadioSelect
          label="Offered in"
          error={
            subjectFormik.errors.type && subjectFormik.touched.type
              ? subjectFormik.errors.type
              : null
          }
        >
          <RadioSelectItem
            name="type"
            value="college"
            checked={subjectFormik.values.type == 'college'}
          >
            College
          </RadioSelectItem>
          <RadioSelectItem
            name="type"
            value="shs"
            checked={subjectFormik.values.type == 'shs'}
          >
            Senior High
          </RadioSelectItem>
        </RadioSelect>
        <RadioSelect
          label="Semester"
          error={
            subjectFormik.errors.semester && subjectFormik.touched.semester
              ? subjectFormik.errors.semester
              : null
          }
        >
          <RadioSelectItem
            name="semester"
            value={1}
            checked={Number(subjectFormik.values.semester) == 1}
          >
            First
          </RadioSelectItem>
          <RadioSelectItem
            name="semester"
            value={2}
            checked={Number(subjectFormik.values.semester) == 2}
          >
            Second
          </RadioSelectItem>
        </RadioSelect>
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
