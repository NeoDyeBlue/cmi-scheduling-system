import Sidebar from '../Navigation/Sidebar';
import useNavStore from '@/stores/useNavStore';
import { MdMenu } from 'react-icons/md';
import { useRef } from 'react';
import useOnClickOutside from '@/hooks/useOutsideClick';
import classNames from 'classnames';

export default function MainLayout({ children, name }) {
  const { isOpen, setIsOpen } = useNavStore();
  const navBarRef = useRef(null);
  useOnClickOutside(navBarRef, () => setIsOpen(false));
  return (
    <div className="relative mx-auto flex min-h-screen w-full 2xl:container">
      <div
        ref={navBarRef}
        className={classNames(
          'fixed top-0 left-0 z-50 h-screen transition-transform md:relative md:block',
          {
            'translate-x-0': isOpen,
            '-translate-x-full md:translate-x-0': !isOpen,
          }
        )}
      >
        <Sidebar />
      </div>
      <div className="flex h-screen w-full flex-col overflow-y-auto">
        <div
          className={classNames('flex items-center gap-4 px-6', {
            'pt-6': name,
          })}
        >
          <button
            onClick={() => setIsOpen(true)}
            className={classNames('md:hidden', { 'mt-6': !name })}
          >
            <MdMenu size={32} />
          </button>
          {name && (
            <h1 className="font-display text-2xl font-bold capitalize md:text-3xl">
              {name}
            </h1>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
