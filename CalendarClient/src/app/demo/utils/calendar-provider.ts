import { Injectable } from '@angular/core'
import { SelectItem } from 'primeng/api'
import { Observable, of } from 'rxjs'
import {
    CalendarDropEvent,
    CalendarEntry,
    CalendarTypeEnum,
    ICalendarService,
} from 'src/app/calendar/models'
import { HttpClient, HttpClientModule } from '@angular/common/http'

@Injectable()
export class ProviderService implements ICalendarService {
    url = 'https://localhost:7157/Event'
    constructor(private http: HttpClient) {}
    getCalendars(): Observable<SelectItem[]> {
        this.http.get(this.url).subscribe((x) => {
            // console.log(x)
        })
        return of([])
    }
    getEvents(
        startdate: Date,
        endDate: Date,
        calendarIds: number[],
        calendarType: CalendarTypeEnum
    ): Observable<CalendarEntry[]> {
        return this.http.get<CalendarEntry[]>(this.url)
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
