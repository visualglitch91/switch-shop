export function round(number: number, decimalPlaces = 2) {
  return Math.floor(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function humanizeBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const digitGroups = Math.floor(Math.log(bytes) / Math.log(1024));
  const convertedSize = round(bytes / Math.pow(1024, digitGroups), 2);
  const unit = units[digitGroups];

  return `${convertedSize} ${unit}`;
}
