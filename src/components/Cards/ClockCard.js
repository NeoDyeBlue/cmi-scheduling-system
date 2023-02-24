import useDateTime from "@/hooks/useDateTime";
import format from "date-fns/format";
import Wave from "react-wavify";
import { motion } from "framer-motion";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";

export default function ClockCard() {
  const dateTime = useDateTime();
  const { theme } = resolveConfig(tailwindConfig);
  const percentage = 30;

  return (
    <div
      className={`relative flex h-full min-h-[150px] w-full flex-col items-center justify-center gap-1
    overflow-hidden rounded-lg border border-primary-200 bg-gradient-to-b from-primary-200 to-primary-100 p-4
    text-center text-primary-900`}
    >
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${percentage}%` }}
        transition={{ ease: "easeOut", duration: 2 }}
        className="absolute bottom-0 w-full overflow-hidden"
      >
        <Wave
          className="h-full"
          fill="url(#gradient)"
          paused={false}
          options={{
            height: 20,
            amplitude: 20,
            speed: 0.15,
            points: 3,
          }}
        >
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="10%" stopColor={theme.colors.primary[400]} />
              <stop offset="90%" stopColor={theme.colors.primary[500]} />
            </linearGradient>
          </defs>
        </Wave>
      </motion.div>
      <p className="z-10">{format(dateTime, "PPPP")}</p>
      <p className="z-10 font-display text-4xl font-semibold">
        {format(dateTime, "p")}
      </p>
    </div>
  );
}
