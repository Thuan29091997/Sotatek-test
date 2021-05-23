
export function getDate(date: Date): string {
  function getMonth(month: number): string {
    const monthStr = `0${month}`;
    return monthStr.substr(monthStr.length - 2, 2);
  }

  return `${date.getFullYear()}-${getMonth(date.getMonth() + 1)}-${date.getDate()}`;
}

export function cloneData(data: any): any {
  return JSON.parse(JSON.stringify(data));
}