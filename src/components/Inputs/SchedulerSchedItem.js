import Image from 'next/image';
import { TeacherTypeBadge } from '../Misc';

export default function SchedulerSchedItem({ key, data }) {
  return (
    <div
      key={key}
      className="flex flex-col items-center justify-center overflow-hidden rounded-md bg-white p-4"
    >
      <Image
        src={data?.teacher?.image}
        alt="teacher image"
        width={42}
        height={42}
        className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
      />
      <div className="flex flex-col text-center">
        <p className="font-display font-semibold">{data.code}</p>
        <p className="mb-1 text-xs">{data.name}</p>
      </div>
      <div className="flex flex-col text-center">
        <p className="font-medium">
          {data?.teacher?.firstName} {data?.teacher?.lastName}
        </p>
        <TeacherTypeBadge isPartTime={data?.teacher?.type == 'part-time'} />
      </div>
    </div>
  );
}
