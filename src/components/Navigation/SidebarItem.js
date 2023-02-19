import Link from "next/link";
import { useRouter } from "next/router";
import useNavStore from "@/stores/useNavStore";

export default function SidebarItem({ outlinedIcon, filledIcon, link, name }) {
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
              ? "bg-primary-100 font-semibold text-primary-900"
              : "hover:bg-gray-100"
          }`}
      >
        {/* icon */}
        <div
          className={`flex items-center justify-center rounded-lg p-4
            ${
              currentRoute == link
                ? "bg-gradient-to-br from-primary-600 to-primary-900 text-white"
                : ""
            }`}
        >
          {filledIcon && outlinedIcon
            ? currentRoute == link
              ? filledIcon
              : outlinedIcon
            : outlinedIcon || filledIcon}
        </div>
        {/* link name */}
        {!isMinimized && <p className="mr-4">{name}</p>}
      </Link>
    </li>
  );
}
