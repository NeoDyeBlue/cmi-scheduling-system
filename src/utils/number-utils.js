export function addOrdinalSuffix(num) {
  if (num % 100 >= 11 && num % 100 <= 13) {
    return num + 'th';
  } else if (num % 10 === 1) {
    return num + 'st';
  } else if (num % 10 === 2) {
    return num + 'nd';
  } else if (num % 10 === 3) {
    return num + 'rd';
  } else {
    return num + 'th';
  }
}
