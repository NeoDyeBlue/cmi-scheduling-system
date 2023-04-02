import classNames from 'classnames';

export default function SchedulerLayoutItemButton({
  icon = <></>,
  onClick = () => {},
}) {
  return (
    <button
      onClick={() => onClick()}
      className={classNames(
        `aspect-square items-center justify-center rounded-full border border-gray-200 bg-white p-[0.15rem] text-center`
      )}
    >
      {icon}
    </button>
  );
}
