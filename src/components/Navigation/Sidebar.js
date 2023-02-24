import Image from 'next/image';
import SidebarItem from './SidebarItem';
import {
  MdOutlineHome,
  MdHome,
  MdOutlineDoorFront,
  MdDoorFront,
  MdOutlineLightbulb,
  MdLightbulb,
  MdOutlineGroups,
  MdGroups,
  MdOutlineAccessTime,
  MdAccessTimeFilled,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdClose,
  MdOutlineSchool,
  MdSchool,
} from 'react-icons/md';
import useNavStore from '@/stores/useNavStore';
import classNames from 'classnames';

export default function Sidebar() {
  const { isMinimized, setIsMinimized, setIsOpen } = useNavStore();
  return (
    <nav
      className={classNames(
        'relative flex h-full w-full max-w-[250px] flex-col justify-between gap-4 border-r border-gray-300 bg-white p-6 md:max-w-[300px]',
        { 'md:items-center': isMinimized }
      )}
    >
      {/* logo */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setIsOpen(false)}
          className="self-start md:hidden"
        >
          <MdClose size={32} />
        </button>
        <div className="flex min-h-[64px] items-center gap-2">
          <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden">
            <Image
              src={'/logo/cmi.png'}
              alt="college of mary immaculate logo"
              fill
            />
          </div>
          <div
            className={`flex flex-col ${isMinimized ? 'block md:hidden' : ''}`}
          >
            <p className="text-md font-display font-semibold text-primary-900">
              College of Mary Immaculate
            </p>
            <p className="text-sm font-light uppercase tracking-widest">
              scheduler
            </p>
          </div>
        </div>
      </div>
      {/* menu */}
      <ul className="flex flex-col gap-2" onClick={() => setIsOpen(false)}>
        <SidebarItem
          outlinedIcon={<MdOutlineHome size={24} />}
          filledIcon={<MdHome size={24} />}
          link="/"
          name="Dashboard"
        />
        <SidebarItem
          outlinedIcon={<MdOutlineAccessTime size={24} />}
          filledIcon={<MdAccessTimeFilled size={24} />}
          link="/schedules"
          name="Schedules"
        />
        <SidebarItem
          outlinedIcon={<MdOutlineGroups size={24} />}
          filledIcon={<MdGroups size={24} />}
          link="/teachers"
          name="Teachers"
        />
        <SidebarItem
          outlinedIcon={<MdOutlineLightbulb size={24} />}
          filledIcon={<MdLightbulb size={24} />}
          link="/subjects"
          name="Subjects"
        />
        <SidebarItem
          outlinedIcon={<MdOutlineDoorFront size={24} />}
          filledIcon={<MdDoorFront size={24} />}
          link="/rooms"
          name="Rooms"
        />
        <SidebarItem
          outlinedIcon={<MdOutlineSchool size={24} />}
          filledIcon={<MdSchool size={24} />}
          link="/courses"
          name="Courses"
        />
      </ul>
      <p className="text-sm">{isMinimized ? '❣️' : 'In development'}</p>
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute bottom-[15%] right-[-15px] hidden aspect-square h-[30px] w-[30px] rounded-full border border-gray-300 bg-white
      p-1 text-center shadow-md md:block"
      >
        {!isMinimized ? (
          <MdKeyboardArrowLeft size={20} />
        ) : (
          <MdKeyboardArrowRight size={20} />
        )}
      </button>
    </nav>
  );
}
