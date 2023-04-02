import { parse, format, addMinutes, differenceInMinutes } from 'date-fns';

export function subtractDuration(
  duration = { hours: 0, minutes: 0 },
  toSubtractDuration = { hours: 0, minutes: 0 }
) {
  // Convert duration1 to total minutes
  const duration1TotalMinutes = duration.hours * 60 + duration.minutes;

  // Convert duration2 to total minutes
  const duration2TotalMinutes =
    toSubtractDuration.hours * 60 + toSubtractDuration.minutes;

  // Subtract the two durations
  const resultTotalMinutes = duration1TotalMinutes - duration2TotalMinutes;

  // Convert the result back to hours and minutes
  const hours = Math.floor(resultTotalMinutes / 60);
  const minutes = resultTotalMinutes % 60;

  return { hours, minutes };
}

export function createTimePairs(
  startTime = '6:00 AM',
  endTime = '6:00 PM',
  interval = 30
) {
  const start = parse(startTime, 'hh:mm a', new Date());
  const end = parse(endTime, 'hh:mm a', new Date());

  let current = start;
  const times = [];

  while (current <= end) {
    times.push(format(current, 'h:mm a'));
    current = addMinutes(current, interval);
  }

  const pairedTimes = times.reduce((accumulator, currentItem, currentIndex) => {
    if (currentIndex !== times.length - 1) {
      return [...accumulator, [currentItem, times[currentIndex + 1]]];
    }
    return accumulator;
  }, []);

  return pairedTimes;
}
