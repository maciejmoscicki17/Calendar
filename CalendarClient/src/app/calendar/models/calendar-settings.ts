import { DailyViewIntervalHeight, DailyViewTimeInterval } from '.'

export class CalendarSettings {
    visibleEventCount: number
    timeInterval: DailyViewTimeInterval
    intervalHeight: DailyViewIntervalHeight
    constructor(
        eventCount: number = 3,
        interval: DailyViewTimeInterval = 30,
        height: DailyViewIntervalHeight = 30
    ) {
        this.visibleEventCount = eventCount
        this.timeInterval = interval
        this.intervalHeight = height
    }
}
