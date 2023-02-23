export default function CountCard({ label, count = 0, icon, iconColor }) {
  return (
    <div className="flex flex-col justify-center gap-1 rounded-lg border border-gray-300 p-4">
      {icon && (
        <span
          //   style={{ backgroundColor: iconColor }
          className="flex h-[20px] w-[20px] items-center justify-center rounded-md bg-gradient-to-br from-primary-400 to-primary-500
          p-1 text-white"
        >
          {icon}
        </span>
      )}
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-display text-2xl font-semibold">{count}</p>
    </div>
  );
}
