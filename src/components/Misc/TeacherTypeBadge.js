import { MdCircle, MdIncompleteCircle } from "react-icons/md";

export default function TeacherTypeBadge({ isPartTime = false }) {
  return (
    <p
      className={`flex w-fit items-center gap-1 whitespace-nowrap rounded-full border px-2 
    py-[0.1rem] text-xs font-semibold
    ${
      isPartTime
        ? "border-warning-600 bg-warning-100 text-warning-600"
        : "border-success-600 bg-success-100 text-success-600"
    }`}
    >
      {isPartTime ? <MdIncompleteCircle size={10} /> : <MdCircle size={10} />}
      {isPartTime ? "part-time" : "full-time"}
    </p>
  );
}
