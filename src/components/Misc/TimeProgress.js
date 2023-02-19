import { motion } from "framer-motion";

export default function TimeProgress({ start, end }) {
  const percentage = 30;
  return (
    <div
      className="relative min-w-[200px] overflow-hidden rounded-full
    text-sm font-semibold leading-none"
    >
      {/* front */}
      <div
        className="flex h-full w-full items-center justify-between
       bg-primary-100 px-2 py-1 text-primary-900"
      >
        <p>{start}</p>
        <p>{end}</p>
      </div>
      {/* back */}
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
        transition={{ ease: "easeOut", duration: 2 }}
        className="absolute left-0 top-0 flex h-full w-full items-center
        justify-between bg-primary-900 px-2 py-1 text-primary-100"
      >
        <p>{start}</p>
        <p>{end}</p>
      </motion.div>
    </div>
  );
}
