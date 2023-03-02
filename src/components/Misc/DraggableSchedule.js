import React from 'react';
import { useDrag } from 'react-dnd';

/**
 * Your Component
 */
export default function DraggableSchedule({ isDragging, text }) {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'text',
      item: { text },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );
  return (
    <li
      className="flex h-[80px] w-full items-center justify-center rounded-md border
  border-black bg-white"
      ref={dragRef}
      style={{ opacity }}
    >
      {text}
    </li>
  );
}
