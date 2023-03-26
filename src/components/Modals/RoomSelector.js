import { SearchForm } from '../Forms';
import { rooms } from '@/lib/test_data/scheduler';
import useSchedulerStore from '@/stores/useSchedulerStore';
import { toast } from 'react-hot-toast';
import { useState, useCallback, useEffect } from 'react';
import { MdSearch } from 'react-icons/md';
import { shallow } from 'zustand/shallow';
import { PopupLoader } from '../Loaders';

export default function RoomSelector({ onSelectClose }) {
  const { selectedRooms, setSelectedRooms } = useSchedulerStore(
    useCallback(
      (state) => ({
        selectedRooms: state.selectedRooms,
        setSelectedRooms: state.setSelectedRooms,
      }),
      []
    ),
    shallow
  );
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchedItems, setSearchedItems] = useState([]);

  useEffect(() => {
    if (inputValue) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(
        `/api/rooms/search?${new URLSearchParams({
          q: inputValue,
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
  }, [inputValue]);

  const roomItems = searchedItems.map((room) => (
    <li
      key={room.code}
      onClick={() => addToSelectedRooms(room.code, room)}
      className="group flex cursor-pointer flex-col justify-center gap-1 rounded-md border
      border-gray-200 p-4 hover:border-primary-400 hover:bg-primary-400 hover:text-white"
    >
      <p className="font-display font-semibold uppercase">{room.code}</p>
      <p className="text-ship-gray-500 group-hover:text-white">{room.name}</p>
    </li>
  ));

  async function getRoomExistingScheds(roomCode) {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/rooms/${roomCode}?p=scheduler`);
      const result = await res.json();

      if (result?.success) {
        setSelectedRooms([...selectedRooms, result?.data]);
        onSelectClose();
      } else {
        toast.error("Can't get room schedules");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Can't get room schedules");
    }
  }

  async function addToSelectedRooms(roomCode) {
    const existing = selectedRooms.some((room) => room.code == roomCode);
    if (existing) {
      toast.error('Room is already added');
    } else {
      await getRoomExistingScheds(roomCode);
    }
  }

  return (
    <>
      <PopupLoader isOpen={isLoading} message="Getting room schedules..." />
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center overflow-hidden rounded-lg border border-ship-gray-200 bg-white">
          <input
            name="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter room code or name..."
            type="text"
            className="w-full px-4 py-3 placeholder:text-ship-gray-300 focus:outline-none"
          />
          <div className="mr-3 text-ship-gray-300">
            <MdSearch size={24} />
          </div>
        </div>
        <ul className="flex flex-col gap-2">{roomItems}</ul>
      </div>
    </>
  );
}
