export function getPHDateString(date: Date = new Date()): string {
  // Uses en-CA because it formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(date);
}
