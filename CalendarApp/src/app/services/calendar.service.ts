import { Injectable } from '@angular/core';
import {
  CalendarDropEvent,
  CalendarEntry,
  CalendarTypeEnum,
  ICalendarService,
} from '../calendar/models';
import { HttpClient } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import { Observable, of } from 'rxjs';

export interface DateDto {
  start: Date;
  end: Date;
  description: string;
  color: string;
}

@Injectable()
export class CalendarProviderService implements ICalendarService {
  url = 'https://localhost:7157/Event';
  constructor(private http: HttpClient) {}
  putEvent(event: CalendarEntry): Observable<CalendarEntry[]> {
    return this.http.put<CalendarEntry[]>(this.url + '/PutEvent', event);
  }
  postEvent(event: CalendarEntry): Observable<void> {
    const dto: DateDto = {
      color: event.color,
      description: event.description,
      start: new Date(event.start),
      end: new Date(event.end),
    };
    return this.http.post<void>(this.url + '/Event', dto);
  }
  getCalendars(): Observable<SelectItem[]> {
    this.http.get(this.url).subscribe((x) => {
      console.warn('getCalendars', x);
    });
    return of([]);
  }
  getEvents(
    startdate: Date,
    endDate: Date,
    calendarIds: number[],
    calendarType: CalendarTypeEnum
  ): Observable<CalendarEntry[]> {
    return this.http.get<CalendarEntry[]>(`${this.url}/Events`);
  }
  getEventDates(
    date: Date,
    calendarIds: number[],
    calendarType: CalendarTypeEnum
  ): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.url}/Dates`);
  }
  onDrop(dropEvent: CalendarDropEvent): Observable<CalendarEntry[]> {
    return this.http.post<CalendarEntry[]>(`${this.url}/Drop`, dropEvent);
  }
}
