export function formatDate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const weekDay = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${month}/${day}(${weekDay})`;
}

export function getNextSunday(date: Date): Date {
  const result = new Date(date);
  result.setDate(date.getDate() + (7 - date.getDay()) % 7);
  return result;
}
