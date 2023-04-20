import { useState, useMemo, useEffect } from 'react';
import { useCombobox, useMultipleSelection } from 'downshift';
import { MdInfo } from 'react-icons/md';
import classNames from 'classnames';
import { toast } from 'react-hot-toast';
import { useField } from 'formik';
import { ImageWithFallback, TeacherTypeBadge } from '../Misc';

export default function MultiComboBox({
  // items,
  placeholder = '',
  label = '',
  infoMessage = '',
  name = '',
  selectionType = 'default',
  searchUrl = '',
  filter = {},
}) {
  const [field, meta, helpers] = useField(name);
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState(field.value);
  const [searchedItems, setSearchedItems] = useState([]);

  // fetcher on input change
  useEffect(() => {
    if (inputValue) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(
        `${searchUrl}?${new URLSearchParams({
          q: inputValue,
          ...filter,
        }).toString()}`,
        { signal }
      )
        .then((res) => res.json())
        .then((result) => {
          if (result?.data && result?.data?.length) {
            setSearchedItems([...result.data]);
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            toast.error('Something went wrong');
          }
        });

      return () => {
        if (signal && controller.abort) {
          controller.abort();
        }
      };
    }
  }, [inputValue, searchUrl, filter]);

  useEffect(
    () => {
      helpers.setValue(selectedItems);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedItems]
  );

  // useMultipleSelection
  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems);
            // helpers.setValue(newSelectedItems);
            break;
          default:
            break;
        }
      },
    });

  // useComboBox
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items: searchedItems,
    itemToString(item) {
      return '';
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            highlightedIndex: 0, // with the first option highlighted.
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            if (selectionType == 'teacher') {
              if (
                !selectedItems.some((item) => item._id == newSelectedItem._id)
              ) {
                const { image, ...newSelected } = newSelectedItem;
                setSelectedItems([...selectedItems, newSelected]);
              } else {
                toast.error('Teacher is already added');
              }
            }

            if (selectionType == 'default') {
              if (
                !selectedItems.some((item) => item.code == newSelectedItem.code)
              ) {
                setSelectedItems([
                  ...selectedItems,
                  { _id: newSelectedItem._id, code: newSelectedItem.code },
                ]);
              } else {
                toast.error('Item is already added');
              }
            }
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue);

          break;
        default:
          break;
      }
    },
  });

  //
  function createTeacherSelectionItems(teachers) {
    const teacherSelectionItems = teachers.map((teacher, index) => (
      <li
        className="flex cursor-pointer gap-3 overflow-hidden p-3 hover:bg-primary-400 hover:text-white"
        key={`${teacher._id}`}
        {...getItemProps({ teacher, index })}
      >
        <ImageWithFallback
          src={teacher.image}
          alt="teacher image"
          width={42}
          height={42}
          fallbackSrc="/images/teachers/default.jpg"
          className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
        />
        <div className="flex w-full flex-col overflow-hidden">
          <p className="font-dsiplay text-ellipsis whitespace-nowrap font-medium">
            {teacher.firstName} {teacher.lastName}
          </p>
          <TeacherTypeBadge isPartTime={teacher.type == 'part-time'} />
        </div>
      </li>
    ));

    return teacherSelectionItems;
  }

  function createDefaultSelectionItems(items) {
    const selectionItems = items.map((item, index) => (
      <li
        className="flex cursor-pointer gap-3 overflow-hidden p-3 hover:bg-primary-400 hover:text-white"
        key={`${item.code}`}
        {...getItemProps({ item, index })}
      >
        <div className="flex w-full flex-col overflow-hidden">
          <p className="font-dsiplay text-ellipsis whitespace-nowrap font-medium uppercase">
            {item.code}
          </p>
          <p className="text-sm">{item.name}</p>
        </div>
      </li>
    ));

    return selectionItems;
  }

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-2">
        {label && (
          <label
            className="w-fit font-display font-medium"
            {...getLabelProps()}
          >
            {label}
          </label>
        )}
        <div className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-ship-gray-200 bg-white p-4">
          {selectedItems?.map((selectedItemForRender, index) => {
            return (
              <span
                className={classNames(
                  'rounded-md px-2 py-1 text-sm focus:bg-red-400 focus:text-white',
                  {
                    'bg-warning-100':
                      selectionType == 'teacher' &&
                      selectedItemForRender.type == 'part-time',
                    'bg-success-100':
                      selectionType == 'teacher' &&
                      selectedItemForRender.type == 'full-time',
                    'bg-primary-200 uppercase': selectionType !== 'teacher',
                  }
                )}
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index,
                })}
              >
                {selectionType == 'teacher'
                  ? `${selectedItemForRender.firstName} ${selectedItemForRender.lastName}`
                  : selectedItemForRender.code}
                <span
                  className="cursor-pointer px-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedItem(selectedItemForRender);
                  }}
                >
                  &#10005;
                </span>
              </span>
            );
          })}
          <div className="flex grow gap-0.5">
            <input
              placeholder={placeholder}
              className="w-full placeholder-ship-gray-300 focus:outline-none"
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
          </div>
        </div>
        {infoMessage && (!meta.error || !meta.touched) && !isOpen && (
          <p className="flex gap-1 text-sm text-ship-gray-400">
            <span>
              <MdInfo size={16} className="-mt-[2px]" />
            </span>
            {infoMessage}
          </p>
        )}
        {meta.error && meta.touched && !isOpen && (
          <p className="flex gap-1 text-sm text-danger-500">
            {/* <span>
            <Error size={16} className="-mt-[2px]" />
          </span> */}
            {meta.error}
          </p>
        )}
      </div>
      <ul
        className={`absolute z-50 mt-1 max-h-[200px] w-full overflow-y-auto rounded-md bg-white p-0 shadow-md ${
          !(isOpen && searchedItems.length) && 'hidden'
        }`}
        {...getMenuProps()}
      >
        {selectionType == 'teacher' && isOpen
          ? createTeacherSelectionItems(searchedItems)
          : null}
        {selectionType !== 'teacher' && isOpen
          ? createDefaultSelectionItems(searchedItems)
          : null}
      </ul>
    </div>
  );
}
