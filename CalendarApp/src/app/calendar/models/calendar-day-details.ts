import { CalendarDay } from './.'

export class CalendarDayDetails {
    constructor(
        public day: CalendarDay,
        public rect: DOMRect
    ) {}
}
