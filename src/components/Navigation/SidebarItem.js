import Link from "next/link";
import { useRouter } from "next/router";
import useNavStore from "@/stores/useNavStore";

export default function SidebarItem({ icon, link, name }) {
  const { isMinimized } = useNavStore();
  const router = useRouter();
  const currentRoute = router.asPath;
  return (
    <li className="relative">
      <Link
        href={link}
        className={`flex items-center gap-4 overflow-hidden rounded-lg font-display
          ${
            currentRoute == link
              ? "bg-primary-100 font-semibold text-primary-700"
              : "hover:bg-primary-100"
          }`}
      >
        {/* icon */}
        <div
          className={`flex items-center justify-center rounded-lg p-4
            ${
              currentRoute == link
                ? "bg-gradient-to-br from-primary-400 to-primary-700 text-white"
                : ""
            }`}
        >
          {icon}
        </div>
        {/* link name */}
        {!isMinimized && <p>{name}</p>}
      </Link>
    </li>
  );
}
