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
