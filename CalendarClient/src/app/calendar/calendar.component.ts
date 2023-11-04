import { Component, OnInit, Inject } from '@angular/core'
import { CalendarService, DataAccessService } from './services'
import { CALENDAR_TOKEN } from './models'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    providers: [CalendarService, DataAccessService],
})
export class CalendarComponent implements OnInit {
    constructor(
        @Inject(CALENDAR_TOKEN)
        private providerService: CalendarService
    ) {}

    ngOnInit(): void {}
}
