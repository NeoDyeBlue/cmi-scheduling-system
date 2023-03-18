import { SearchForm } from '../Forms';
import { rooms } from '@/lib/test_data/scheduler';
import useSchedulerStore from '@/stores/useSchedulerStore';
import { toast } from 'react-hot-toast';

export default function RoomSelector({ onSelectClose }) {
  const { selectedRooms, setSelectedRooms } = useSchedulerStore();
  const roomItems = rooms.map((room) => (
    <li
      key={room.code}
      onClick={() => addToSelectedRooms(room.code, room)}
      className="group flex cursor-pointer flex-col justify-center gap-1 rounded-md border
      border-gray-200 p-4 hover:border-primary-400 hover:bg-primary-400 hover:text-white"
    >
      <p className="font-display font-semibold">{room.code}</p>
      <p className="text-ship-gray-500 group-hover:text-white">{room.name}</p>
    </li>
  ));

  function addToSelectedRooms(roomCode, roomData) {
    const existing = selectedRooms.some((room) => room.code == roomCode);
    if (existing) {
      toast.error('Room is already added');
    } else {
      setSelectedRooms([...selectedRooms, roomData]);
      onSelectClose();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SearchForm placeholder="Enter room code or name" />
      </div>
      <ul className="flex flex-col gap-2">{roomItems}</ul>
    </div>
  );
}
