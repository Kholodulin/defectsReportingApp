import { Pipe, PipeTransform } from '@angular/core';
import { Locale, format as formatDate } from 'date-fns';
import { enGB } from 'date-fns/locale';

@Pipe({
  name: 'appCustomDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  transform(
    value: string | Date,
    format: string = 'dd.MM.yyyy'
  ): string | null {
    if (!value) return null;

    const locale: Locale = enGB;
    return formatDate(value, format, { locale });
  }
}
