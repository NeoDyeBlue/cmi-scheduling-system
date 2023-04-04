import classNames from 'classnames';
import dynamic from 'next/dynamic';
const Tooltip = dynamic(
  () => import('react-tooltip').then((module) => ({ default: module.Tooltip })),
  {
    ssr: false,
  }
);

export default function SchedulerLayoutItemButton({
  icon = <></>,
  onClick = () => {},
  toolTipId,
  toolTipContent,
}) {
  return (
    <>
      <button
        data-tooltip-id={toolTipId}
        data-tooltip-content={toolTipContent}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={classNames(
          `aspect-square items-center justify-center rounded-lg border border-gray-200 bg-white p-[0.15rem] text-center
           shadow-md`
        )}
      >
        {icon}
      </button>
      {toolTipId && toolTipContent ? (
        <Tooltip
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            backgroundColor: '#3c3744',
            zIndex: 50,
          }}
          id={toolTipId}
          place="bottom"
          delayShow={500}
        />
      ) : null}
    </>
  );
}
