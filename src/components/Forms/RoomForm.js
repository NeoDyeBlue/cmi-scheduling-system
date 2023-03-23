import { FormikProvider, Form, useFormik } from 'formik';
import { InputField } from '../Inputs';
import { Button } from '../Buttons';
import { roomSchema } from '@/lib/validators/room-validator';
import { toast } from 'react-hot-toast';

export default function RoomForm({
  initialData,
  onCancel,
  onAfterSubmit = () => {},
}) {
  const roomFormik = useFormik({
    initialValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
    },
    onSubmit: handleSubmit,
    validationSchema: roomSchema,
  });

  async function handleSubmit(values) {
    try {
      const res = await fetch('/api/rooms', {
        method: initialData ? 'PATCH' : 'POST',
        body: JSON.stringify({
          ...values,
          ...(initialData ? { _id: initialData?._id } : {}),
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (result?.success) {
        toast.success(`Room ${initialData ? 'updated' : 'added'}`);
        onAfterSubmit();
      } else if (!result?.success && result?.error) {
        if (result?.error == 'RoomCodeError') {
          roomFormik.setFieldError('code', result?.errorMessage);
        }
      } else {
        toast.error(`Can't ${initialData ? 'update' : 'add'} room`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Can't ${initialData ? 'update' : 'add'} room`);
    }
  }
  return (
    <FormikProvider value={roomFormik}>
      <Form className="flex flex-col gap-6">
        <InputField
          type="text"
          name="code"
          label="Room Code"
          placeholder="e.g. CB205"
        />
        <InputField
          type="text"
          name="name"
          label="Room Name"
          placeholder="e.g. Computer Laboratory 205"
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
