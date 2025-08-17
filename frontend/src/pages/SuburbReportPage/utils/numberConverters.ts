export const convertNumberToString = (num: number): string => {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return num.toFixed(1).toString();
};

export const convertWithGreaterThan = (num: number): string => {
  return '>' + convertNumberToString(num);
};

export const convertAsFractionOfTen = (num: number): string => {
  return convertNumberToString(num) + '/10';
};

export function mapValueToPercentageString(num: number) {
  return (num * 100).toFixed(2) + '%';
}
