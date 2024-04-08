import { Inject, Injectable } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import {
    CALENDAR_TOKEN,
    CalendarEntry,
    ICalendarService,
    CalendarTypeEnum,
} from '../models'

@Injectable()
export class DataAccessService {
    private subs = new Subscription()

    constructor(
        @Inject(CALENDAR_TOKEN)
        private providerService: ICalendarService
    ) {}

    getEvents(
        date: Date,
        calendarType: CalendarTypeEnum,
        selectedCalendars: number[]
    ): Observable<CalendarEntry[]> {
        let startDate = new Date(date)
        let endDate = new Date(date)
        switch (calendarType) {
            case CalendarTypeEnum.weekly:
                if (startDate.getDay() !== 1) {
                    startDate.setTime(
                        startDate.getTime() -
                            24 * 60 * 60 * 1000 * (startDate.getDay() - 1)
                    )
                    endDate.setTime(startDate.getTime())
                }
                break
            case CalendarTypeEnum.monthly:
                const month = startDate.getMonth()
                let endDay = 0
                if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
                    endDay = 31
                } else if (month == 1) {
                    endDay = 28
                } else endDay = 30
                startDate.setDate(1)
                endDate.setDate(endDay)
                break
            case CalendarTypeEnum.yearly:
            case CalendarTypeEnum.list:
                startDate.setFullYear(startDate.getFullYear(), 0, 1)
                endDate.setFullYear(endDate.getFullYear(), 11, 31)
                break
        }
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        return this.providerService.getEvents(
            startDate,
            endDate,
            selectedCalendars,
            calendarType
        )
    }

    getDzienny(date: Date) {
        return this.getEvents(date, CalendarTypeEnum.weekly, [])
    }

    getWeekly(date: Date): Observable<CalendarEntry[]> {
        return this.getEvents(date, CalendarTypeEnum.weekly, [])
    }
}
