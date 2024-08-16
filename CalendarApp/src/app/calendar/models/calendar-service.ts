import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { CalendarDropEvent, CalendarEntry, CalendarTypeEnum } from '.';

export interface ICalendarService {
  getCalendars(): Observable<SelectItem[]>;
  getEvents(
    startdate: Date,
    endDate: Date,
    calendarIds: number[],
    calendarType: CalendarTypeEnum
  ): Observable<CalendarEntry[]>;
  getEventDates(
    date: Date,
    calendarIds: number[],
    calendarType: CalendarTypeEnum
  ): Observable<Date[]>;
  onDrop(dropEvent: CalendarDropEvent): Observable<CalendarEntry[]>;
  postEvent(event: CalendarEntry): Observable<void>;
  putEvent(event: any): Observable<CalendarEntry[]>;
}
