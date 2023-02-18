import Image from "next/image";
import SidebarItem from "./SidebarItem";
import {
  MdOutlineHome,
  MdOutlineDoorFront,
  MdOutlineLightbulb,
  MdOutlineGroups,
  MdOutlineSchedule,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import useNavStore from "@/stores/useNavStore";

export default function Sidebar() {
  const { isMinimized, setIsMinimized } = useNavStore();
  return (
    <nav
      className={`
      relative flex h-full w-full max-w-[250px] flex-col justify-between gap-4 border-r border-gray-200
    bg-white px-4 py-6 md:pl-0 ${isMinimized ? "items-center" : ""}`}
    >
      {/* logo */}
      <div className="flex min-h-[64px] items-center gap-2">
        <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden">
          <Image
            src={"/logo/cmi.png"}
            alt="college of mary immaculate logo"
            fill
          />
        </div>
        {!isMinimized && (
          <div className="flex flex-col">
            <p className="text-md font-display font-semibold text-primary-900">
              College of Mary Immaculate
            </p>
            <p className="text-sm font-light uppercase tracking-widest">
              scheduler
            </p>
          </div>
        )}
      </div>
      {/* menu */}
      <ul className="flex flex-col gap-2">
        <SidebarItem
          icon={<MdOutlineHome size={24} />}
          link="/"
          name="Dashboard"
        />
        <SidebarItem
          icon={<MdOutlineSchedule size={24} />}
          link="/schedules"
          name="Schedules"
        />
        <SidebarItem
          icon={<MdOutlineGroups size={24} />}
          link="/teachers"
          name="Teachers"
        />
        <SidebarItem
          icon={<MdOutlineLightbulb size={24} />}
          link="/subjects"
          name="Subjects"
        />
        <SidebarItem
          icon={<MdOutlineDoorFront size={24} />}
          link="/rooms"
          name="Rooms"
        />
      </ul>
      <p className="text-sm">{isMinimized ? "❣️" : "In development"}</p>
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute bottom-[15%] right-[-15px] aspect-square h-[30px] w-[30px] rounded-full border border-gray-200 bg-white p-1
      text-center shadow-md"
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
