import { Injectable } from '@angular/core';
import {
  CalendarDropEvent,
  CalendarEntry,
  CalendarTypeEnum,
  ICalendarService,
} from '../../calendar/models';
import { HttpClient } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import { Observable, of } from 'rxjs';

@Injectable()
export class CalendarProviderService implements ICalendarService {
  url = 'https://localhost:7157/Event';
  constructor(private http: HttpClient) {}
  getCalendars(): Observable<SelectItem[]> {
    this.http.get(this.url).subscribe((x) => {
      console.warn(x);
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
    return this.http.get<CalendarEntry[]>(this.url);
  }
}
