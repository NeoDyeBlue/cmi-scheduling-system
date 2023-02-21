import dynamic from "next/dynamic";
const Tooltip = dynamic(
  () => import("react-tooltip").then((module) => ({ default: module.Tooltip })),
  {
    ssr: false,
  }
);
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";

export default function MyTooltip({ id }) {
  const { theme } = resolveConfig(tailwindConfig);
  return (
    <>
      <Tooltip
        style={{
          padding: `${theme.padding[2]} ${theme.padding[3]}`,
          borderRadius: theme.borderRadius["md"],
          backgroundColor: theme.colors["ship-gray"][900],
          zIndex: 40,
        }}
        id={id}
        place="bottom"
        delayShow={500}
      />
    </>
  );
}
