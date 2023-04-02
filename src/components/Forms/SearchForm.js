import { FormikProvider, Form, useFormik, Field } from 'formik';
import { MdSearch } from 'react-icons/md';

export default function SearchForm({ placeholder, onSearch }) {
  const searchFormik = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: handleSubmit,
  });

  function handleSubmit(values) {
    onSearch(values.search);
  }

  return (
    <FormikProvider value={searchFormik}>
      <Form className="flex w-full items-center overflow-hidden rounded-lg border border-ship-gray-200 bg-white">
        <Field
          name="search"
          value={searchFormik.search}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              searchFormik.submitForm();
            }
          }}
          placeholder={placeholder}
          type="text"
          className="w-full px-4 py-3 placeholder:text-ship-gray-300 focus:outline-none"
        />
        <div className="mr-3 text-ship-gray-300">
          <MdSearch size={24} />
        </div>
      </Form>
    </FormikProvider>
  );
}
