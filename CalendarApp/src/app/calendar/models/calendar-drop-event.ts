import { CalendarEntry } from '.'

export class CalendarDropEvent {
    constructor(
        public object: CalendarEntry,
        public day: Date
    ) {}
}
