export default function generateChar(maxColumn) {
  const columns = [];

  for (let i = 0; i < maxColumn; i++) {
    let column = '';
    let num = i;

    while (num >= 0) {
      column = String.fromCharCode(65 + (num % 26)) + column;
      num = Math.floor(num / 26) - 1;
    }

    columns.push(column);
  }

  return columns;
}
