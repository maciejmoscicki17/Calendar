import { Injectable } from '@angular/core'
import { SelectItem } from 'primeng/api'
import { Observable, of } from 'rxjs'
import {
    CalendarDropEvent,
    CalendarEntry,
    CalendarTypeEnum,
    ICalendarService,
} from 'src/app/calendar/models'

@Injectable()
export class ProviderService implements ICalendarService {
    getCalendars(): Observable<SelectItem[]> {
        return of([])
    }
    getEvents(
        startdate: Date,
        endDate: Date,
        calendarIds: number[],
        calendarType: CalendarTypeEnum
    ): Observable<CalendarEntry[]> {
        return of([])
    }
    getEventDates(
        date: Date,
        calendarIds: number[],
        calendarType: CalendarTypeEnum
    ): Observable<Date[]> {
        return of([])
    }
    onDrop(dropEvent: CalendarDropEvent): Observable<CalendarEntry[]> {
        return of([])
    }
}
