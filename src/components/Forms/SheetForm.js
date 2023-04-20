import { useFilePicker } from 'use-file-picker';
import { FormikProvider, Form, useFormik } from 'formik';
import { MdUploadFile, MdWarning } from 'react-icons/md';
import { Button } from '../Buttons';
import { useEffect, useState } from 'react';
import { PopupLoader } from '../Loaders';
import Image from 'next/image';

export default function SheetForm({
  name = '',
  sheetSampleImage = '',
  warningMessage = '',
  message = '',
  requiredColumns = [],
  submitUrl = '',
  onAfterSubmit = () => {},
  onCancel,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const sheetFormik = useFormik({
    initialValues: {
      sheet: '',
    },
    onSubmit: handleSubmit,
  });

  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: 'DataURL',
    accept: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xlsx',
    ],
    multiple: false,
    limitFilesConfig: { max: 1 },
  });

  async function handleSubmit(values) {
    try {
      setIsLoading(true);
      const res = await fetch(submitUrl, {
        method: 'POST',
        body: JSON.stringify({
          ...values,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (result?.success) {
        toast.success(`${name} imported`);
        onAfterSubmit();
      } else {
        toast.error(`Can't import sheet data`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(`Can't import sheet data`);
    }
  }
  useEffect(() => {
    if (filesContent[0]?.content) {
      sheetFormik.setFieldValue('sheet', filesContent[0]?.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesContent]);

  return (
    <FormikProvider value={sheetFormik}>
      <PopupLoader
        message={`importing ${name} please wait...`}
        isOpen={isLoading}
      />
      <Form className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-gray-50 p-4">
          <p className="-mb-1 text-center text-sm font-bold">Chosen File</p>
          <p className="w-full text-center text-lg">&quot;filename&quot;</p>
          <button
            className="flex h-[36px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-green-500
        py-1 px-3 text-white hover:bg-green-600"
          >
            <MdUploadFile size={24} /> Choose a spreadsheet file
          </button>
          <p className="flex text-center text-sm">
            <MdWarning size={16} className="text-warning-500" />
            {warningMessage
              ? warningMessage
              : 'Successful import will remove all previously saved data!'}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-display text-lg font-semibold">
            Instruction for importing {name}
          </p>
          <div className="flex flex-col gap-2">
            <p>
              Choose a spreadsheet file with these column names in the first
              sheet:
            </p>
            <ul className="list-disc pl-6">
              {requiredColumns.map((column, index) => (
                <li className="font-medium" key={index}>
                  {column}
                </li>
              ))}
            </ul>
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
