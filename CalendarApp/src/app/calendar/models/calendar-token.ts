import { InjectionToken } from '@angular/core'
import { ICalendarService } from './.'

export const CALENDAR_TOKEN = new InjectionToken<ICalendarService>(
    'CalendarService'
)
