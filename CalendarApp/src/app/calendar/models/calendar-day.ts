import { CalendarEntry } from './calendar-entry'

export class CalendarDay {
    constructor(
        public number: number,
        public entries: CalendarEntry[],
        public date: Date
    ) {}
}
