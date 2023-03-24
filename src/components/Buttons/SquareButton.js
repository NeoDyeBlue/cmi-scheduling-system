import dynamic from 'next/dynamic';
const Tooltip = dynamic(
  () => import('react-tooltip').then((module) => ({ default: module.Tooltip })),
  {
    ssr: false,
  }
);

export default function SquareButton({
  icon,
  onClick = () => {},
  toolTipId = '',
  toolTipContent = '',
}) {
  return (
    <>
      <button
        data-tooltip-id={toolTipId}
        data-tooltip-content={toolTipContent}
        type="button"
        onClick={onClick}
        className="flex aspect-square flex-shrink-0 items-center justify-center rounded-md p-1 leading-none hover:bg-gray-100"
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
