import Sidebar from "../Navigation/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full 2xl:container">
      <div className="sticky top-0 z-[999] hidden h-screen md:block">
        <Sidebar />
      </div>
      <div className="h-screen w-full overflow-y-auto">{children}</div>
    </div>
  );
}
