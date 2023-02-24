import { useFilePicker } from 'use-file-picker';
import Image from 'next/image';
import { MdAccountBox, MdOutlineAccountBox, MdInfo } from 'react-icons/md';
import { useField } from 'formik';
import { useEffect } from 'react';

export default function ImagePicker({ label, infoMessage, ...props }) {
  const [field, meta, helpers] = useField(props);
  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: 'DataURL',
    accept: ['image/jpeg', 'image/png'],
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 5,
  });
  useEffect(() => {
    helpers.setValue(filesContent[0]?.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesContent]);

  return (
    <div className="flex flex-col gap-2">
      {label && <p className="font-display font-medium">{label}</p>}
      <button
        type="button"
        onBlur={field.onBlur}
        id={props.name}
        onClick={openFileSelector}
        className="relative flex h-[120px] w-[120px] flex-col items-center justify-center
      overflow-hidden rounded-lg border border-ship-gray-200 text-ship-gray-300"
      >
        {meta.value && !errors.length && !meta.error ? (
          <Image
            fill
            src={meta.value}
            alt="profile image"
            className="object-cover"
          />
        ) : (
          <>
            <MdAccountBox size={36} />
            <p className="text-xs font-medium">Choose Image</p>
          </>
        )}
      </button>
      {infoMessage && (!meta.error || !meta.touched) && (
        <p className="flex gap-1 text-sm text-ship-gray-400">
          <span>
            <MdInfo size={16} />
          </span>
          {infoMessage}
        </p>
      )}
      {(meta.error && meta.touched) || errors.length ? (
        <p className="flex gap-1 text-sm text-danger-500">
          {/* <span>
              <Error size={16} className="-mt-[2px]" />
            </span> */}
          {meta.error ? meta.error : null}
          {errors.length ? (
            <>
              {errors[0].fileSizeToolarge && 'File size is too large!'}
              {errors[0].readerError && 'Problem occured while reading file!'}
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
