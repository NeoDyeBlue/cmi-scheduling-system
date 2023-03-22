import { useState, useMemo, useEffect } from 'react';
import { useCombobox, useMultipleSelection } from 'downshift';
import classNames from 'classnames';
import { toast } from 'react-hot-toast';

export default function MultiComboBox({
  items,
  placeholder,
  label,
  infoMessage,
  name,
  selectionType = 'default',
  searchUrl = '',
}) {
  const [field, meta, helpers] = useField(name);
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchedItems, setSearchedItems] = useState([]);

  // fetcher on input change
  useEffect(() => {
    if (inputValue) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(`${searchUrl}?search=${inputValue}`, { signal })
        .then((res) => res.json())
        .then((data) => setSearchedItems([...data.docs]))
        .catch((err) => toast.error('Something went wrong'));

      return () => {
        if (signal && controller.abort) {
          controller.abort();
        }
      };
    }
  }, [inputValue, searchUrl]);

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
    // itemToString(item) {
    //   return item ? item.title : '';
    // },
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
            setSelectedItems([...selectedItems, newSelectedItem]);
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

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-2" id={name} onBlur={field.onBlur}>
        <label className="w-fit font-display font-medium" {...getLabelProps()}>
          {label}
        </label>
        <div className="inline-flex flex-wrap items-center gap-2 bg-white p-1.5 shadow-sm">
          {selectedItems.map((selectedItemForRender, index) => {
            return (
              <span
                className="rounded-md bg-gray-100 px-1 focus:bg-red-400"
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
              placeholder="Best book ever"
              className="w-full placeholder-ship-gray-300 focus:outline-none"
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
            <button
              aria-label="toggle menu"
              className="px-2"
              type="button"
              {...getToggleButtonProps()}
            >
              &#8595;
            </button>
          </div>
        </div>
      </div>
      <ul
        className={`w-inherit absolute mt-1 max-h-80 overflow-scroll bg-white p-0 shadow-md ${
          !(isOpen && items.length) && 'hidden'
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={classNames(
                { 'bg-blue-300': highlightedIndex === index },
                { 'font-bold': selectedItem === item },
                'flex flex-col py-2 px-3 shadow-sm'
              )}
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
            >
              <span>{item.title}</span>
              <span className="text-sm text-gray-700">{item.author}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
