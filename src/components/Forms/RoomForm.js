import { FormikProvider, Form, useFormik } from 'formik';
import { InputField } from '../Inputs';
import { Button } from '../Buttons';
import { roomSchema } from '@/lib/validators/room-validator';

export default function RoomForm({ initialData, onCancel }) {
  const roomFormik = useFormik({
    initialValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
    },
    onSubmit: handleSubmit,
    validationSchema: roomSchema,
  });

  async function handleSubmit(values) {
    console.log(values);
  }
  return (
    <FormikProvider value={roomFormik}>
      <Form className="flex flex-col gap-6">
        <InputField type="text" name="code" label="Room Code" />
        <InputField type="text" name="name" label="Room Name" />
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
