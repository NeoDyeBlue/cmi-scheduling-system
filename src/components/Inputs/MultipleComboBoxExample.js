import { useState, useMemo } from 'react';
import { useCombobox, useMultipleSelection } from 'downshift';
import classNames from 'classnames';

export default function MultipleComboBoxExample() {
  const books = [
    { author: 'Harper Lee', title: 'To Kill a Mockingbird' },
    { author: 'Lev Tolstoy', title: 'War and Peace' },
    { author: 'Fyodor Dostoyevsy', title: 'The Idiot' },
    { author: 'Oscar Wilde', title: 'A Picture of Dorian Gray' },
    { author: 'George Orwell', title: '1984' },
    { author: 'Jane Austen', title: 'Pride and Prejudice' },
    { author: 'Marcus Aurelius', title: 'Meditations' },
    { author: 'Fyodor Dostoevsky', title: 'The Brothers Karamazov' },
    { author: 'Lev Tolstoy', title: 'Anna Karenina' },
    { author: 'Fyodor Dostoevsky', title: 'Crime and Punishment' },
  ];
  const initialSelectedItems = [books[0], books[1]];

  function getFilteredBooks(selectedItems, inputValue) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return books.filter(function filterBook(book) {
      return (
        !selectedItems.includes(book) &&
        (book.title.toLowerCase().includes(lowerCasedInputValue) ||
          book.author.toLowerCase().includes(lowerCasedInputValue))
      );
    });
  }

  function MultipleComboBox() {
    const [inputValue, setInputValue] = useState('');
    const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
    const items = useMemo(
      () => getFilteredBooks(selectedItems, inputValue),
      [selectedItems, inputValue]
    );
    const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
      useMultipleSelection({
        selectedItems,
        onStateChange({ selectedItems: newSelectedItems, type }) {
          switch (type) {
            case useMultipleSelection.stateChangeTypes
              .SelectedItemKeyDownBackspace:
            case useMultipleSelection.stateChangeTypes
              .SelectedItemKeyDownDelete:
            case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
            case useMultipleSelection.stateChangeTypes
              .FunctionRemoveSelectedItem:
              setSelectedItems(newSelectedItems);
              break;
            default:
              break;
          }
        },
      });
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
      items,
      itemToString(item) {
        return item ? item.title : '';
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
      <div className="w-full">
        <div className="flex flex-col gap-2">
          <label
            className="w-fit font-display font-medium"
            {...getLabelProps()}
          >
            Pick some books:
          </label>
          <div className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-ship-gray-200 p-4">
            {selectedItems.map(function renderSelectedItem(
              selectedItemForRender,
              index
            ) {
              return (
                <span
                  className="rounded-md bg-gray-200 px-2 py-1 text-sm focus:bg-red-400 focus:text-white"
                  key={`selected-item-${index}`}
                  {...getSelectedItemProps({
                    selectedItem: selectedItemForRender,
                    index,
                  })}
                >
                  {selectedItemForRender.title}
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
                placeholder="Enter subject code or name..."
                className="w-full placeholder-ship-gray-300 focus:outline-none"
                {...getInputProps(
                  getDropdownProps({ preventKeyAction: isOpen })
                )}
              />
              {/* <button
                aria-label="toggle menu"
                className="px-2"
                type="button"
                {...getToggleButtonProps()}
              >
                &#8595;
              </button> */}
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
  return <MultipleComboBox />;
}
