import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format?: string): string {
    if (!value) return '—';

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) return '—';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const dateStr = `${day}/${month}/${year}`;

    if (!format || format === 'date') {
      return dateStr;
    }

    if (format === 'time') {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    if (format === 'datetime') {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${dateStr} ${hours}:${minutes}`;
    }

    return dateStr;
  }
}
