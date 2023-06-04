import { FormikProvider, Form, useFormik, FieldArray } from 'formik';
import { InputField } from '../Inputs';
import { Button, ActionButton } from '../Buttons';
import { RadioSelect, RadioSelectItem, MultiComboBox } from '../Inputs';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import { MdAdd, MdRemove } from 'react-icons/md';
import { sectionSchema } from '@/lib/validators/course-validator';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { PopupLoader } from '../Loaders';
import _ from 'lodash';

export default function KinderForm({
  initialData,
  onCancel,
  onAfterSubmit = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = resolveConfig(tailwindConfig);

  const kinderFormik = useFormik({
    initialValues: {
      name: initialData?.name || '',
    },
    onSubmit: handleSubmit,
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
          kinderFormik.setFieldError('code', result?.errorMessage);
        }
      } else {
        toast.error(`Can't ${initialData ? 'update' : 'add'} section`);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(`Can't ${initialData ? 'update' : 'add'} section`);
    }
  }
  return (
    <FormikProvider value={kinderFormik}>
      <PopupLoader
        message={`${initialData ? 'Updating' : 'Adding'} section`}
        isOpen={isLoading}
      />
      <Form className="flex flex-col gap-6">
        <InputField label="Section Name (optional)" name="name" />
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
