import Image from "next/image";
import SidebarItem from "./SidebarItem";
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
} from "react-icons/md";
import useNavStore from "@/stores/useNavStore";

export default function Sidebar() {
  const { isMinimized, setIsMinimized } = useNavStore();
  return (
    <nav
      className={`
      relative flex h-full w-full max-w-[300px] flex-col justify-between gap-4 border-r border-gray-300
    bg-white p-6 ${isMinimized ? "items-center" : ""}`}
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
      </ul>
      <p className="text-sm">{isMinimized ? "❣️" : "In development"}</p>
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute bottom-[15%] right-[-15px] aspect-square h-[30px] w-[30px] rounded-full border border-gray-300 bg-white p-1
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
