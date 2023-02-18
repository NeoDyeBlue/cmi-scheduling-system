import Sidebar from "../Navigation/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="container mx-auto flex h-screen min-h-[620px] w-full gap-4 px-4 lg:px-0">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
