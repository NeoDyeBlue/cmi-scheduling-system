import Sidebar from "../Navigation/Sidebar";
import useNavStore from "@/stores/useNavStore";
import { MdMenu } from "react-icons/md";
import { useRef } from "react";
import useOnClickOutside from "@/hooks/useOutsideClick";

export default function MainLayout({ children, name }) {
  const { isOpen, setIsOpen } = useNavStore();
  const navBarRef = useRef(null);
  useOnClickOutside(navBarRef, () => setIsOpen(false));
  return (
    <div className="relative mx-auto flex min-h-screen w-full 2xl:container">
      <div
        ref={navBarRef}
        className={`fixed top-0 left-0 z-50 h-screen transition-transform md:relative
      md:block ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
      >
        <Sidebar />
      </div>
      <div className="flex h-screen w-full flex-col overflow-y-auto">
        <div className="flex items-center gap-4 px-6 pt-6">
          <button onClick={() => setIsOpen(true)} className="md:hidden">
            <MdMenu size={32} />
          </button>
          <h1 className="font-display text-2xl font-bold capitalize md:text-3xl">
            {name}
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
