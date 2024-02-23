import { Component, OnInit, Inject } from '@angular/core'
import { CalendarService, DataAccessService } from './services'
import { CALENDAR_TOKEN, CalendarTypeEnum, ICalendarService } from './models'
import { TranslationService } from './services/translation.service'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    providers: [CalendarService, DataAccessService],
})
export class CalendarComponent implements OnInit {
    constructor(
        @Inject(CALENDAR_TOKEN)
        private providerService: ICalendarService,
        private calendarService: CalendarService,
        private translationService: TranslationService
    ) {}

    ngOnInit(): void {
        this.providerService
            .getEvents(new Date(), new Date(), [], CalendarTypeEnum.daily)
            .subscribe((x) => {
                this.calendarService.data = x
                this.calendarService.$dataChanged.next(null)
            })
    }
}
