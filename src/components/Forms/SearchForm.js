import { FormikProvider, Form, useFormik } from 'formik';
import { MdSearch } from 'react-icons/md';

export default function SearchForm({ placeholder, onSearch }) {
  const searchFormik = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: onSearch,
  });

  return (
    <FormikProvider value={searchFormik}>
      <Form className="flex w-full items-center overflow-hidden rounded-lg border border-ship-gray-200">
        <input
          name="search"
          //   value={searchFormik.search}
          placeholder={placeholder}
          type="text"
          className="w-full px-4 py-3 placeholder:text-ship-gray-300 focus:outline-none"
        />
        {/* <div className="p-2">
          <button
            type="submit"
            className="aspect-square rounded-lg bg-primary-700 p-2 text-center
        text-white transition-colors hover:bg-primary-800 active:bg-primary-900"
          >
            <MdSearch size={24} />
          </button>
        </div> */}
        <div className="mr-3 text-ship-gray-300">
          <MdSearch size={24} />
        </div>
      </Form>
    </FormikProvider>
  );
}
