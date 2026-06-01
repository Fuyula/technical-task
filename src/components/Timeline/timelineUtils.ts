import { format, parseISO } from 'date-fns';

export function toLocalKey(iso: string, period: 'day' | 'hour'): string {
  return format(
    new Date(iso),
    period === 'hour' ? "yyyy-MM-dd'T'HH" : 'yyyy-MM-dd',
  );
}
export function groupBy<T>(
  list: T[],
  keyGetter: (item: T) => string,
  period: 'day' | 'hour',
): Map<string, T[]> {
  const map = new Map();
  list.forEach((item) => {
    const currentKey: string = keyGetter(item).slice(
      0,
      period === 'day' ? 10 : 13,
    );
    const collection = map.get(currentKey);
    if (!collection) {
      map.set(currentKey, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function formatTimeForReader(date: Date | string): string {
  return format(new Date(date), 'h:mm:ss a');
}

export const formatDayForReader = (dayKey: string) =>
  format(parseISO(dayKey), 'EEEE, MMMM d, yyyy');
