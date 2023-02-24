import { FormikProvider, Form, useFormik } from 'formik';
import { InputField } from '../Inputs';
import { Button } from '../Buttons';
import { subjectSchema } from '@/lib/validators/subject-validator';

export default function RoomForm({ initialData, onCancel }) {
  const roomFormik = useFormik({
    initialValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      units: initialData?.units || 1,
    },
    onSubmit: handleSubmit,
    validationSchema: subjectSchema,
  });

  async function handleSubmit(values) {
    console.log(values);
  }
  return (
    <FormikProvider value={roomFormik}>
      <Form className="flex flex-col gap-6">
        <InputField type="text" name="code" label="Subject Code" />
        <InputField type="text" name="name" label="Subject Name" />
        <InputField type="number" name="units" label="Units" />
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
