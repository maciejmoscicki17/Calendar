import {
    ChangeDetectorRef,
    Component,
    HostListener,
    Inject,
    OnInit,
} from '@angular/core'
import {
    CALENDAR_TOKEN,
    CalendarEntry,
    CalendarDropEvent,
    CalendarDay,
    ICalendarService,
    TranslationsEnum,
} from '../../models'

import { Observable, Subscription, of } from 'rxjs'
import { CalendarService } from '../../services'

@Component({
    selector: 'monthly-view',
    templateUrl: './monthly-view.component.html',
    styleUrls: ['./monthly-view.component.scss'],
})
export class MonthlyViewComponent implements OnInit {
    showDialog = false
    detailsData: Observable<CalendarEntry[]> = of([])
    detailsDay: Date = new Date()

    readonly days = [
        TranslationsEnum.poniedzialek,
        TranslationsEnum.wtorek,
        TranslationsEnum.sroda,
        TranslationsEnum.czwartek,
        TranslationsEnum.piatek,
        TranslationsEnum.sobota,
        TranslationsEnum.niedziela,
    ]

    weeks: CalendarDay[][] = []

    private subs = new Subscription()

    constructor(
        @Inject(CALENDAR_TOKEN)
        providerService: ICalendarService,
        private calendarService: CalendarService,
        private changeDetector: ChangeDetectorRef
    ) {}
    ngOnInit(): void {
        this.subs.add(
            this.calendarService.$dataChanged.subscribe(() => {
                this.generateCalendar()
            })
        )
        this.subs.add(
            this.calendarService.$calendarTypeChange.subscribe(() => {
                this.generateCalendar()
            })
        )
    }

    private generateCalendar() {
        this.calendarService.loading = true
        let dateCopy = new Date(this.calendarService.currentDate)
        dateCopy.setDate(1)
        dateCopy = new Date(
            dateCopy.getTime() -
                (dateCopy.getDay() == 0 ? 6 : dateCopy.getDay() - 1) *
                    24 *
                    60 *
                    60 *
                    1000
        )
        this.weeks = []
        do {
            let week = new Array<CalendarDay>(7)
            for (let i = 0; i < week.length; i++) {
                week[i] = new CalendarDay(
                    dateCopy.getDate(),
                    this.calendarService.data
                        .filter(
                            (x) =>
                                x.start.toDateString() ==
                                    dateCopy.toDateString() ||
                                x.end.toDateString() ==
                                    dateCopy.toDateString() ||
                                (x.start < dateCopy && x.end > dateCopy)
                        )
                        .sort((x, y) => (x.start < y.start ? 0 : 1)),
                    dateCopy
                )
                dateCopy = new Date(dateCopy.getTime() + 24 * 60 * 60 * 1000)
            }
            this.weeks.push(week)
        } while (
            dateCopy.getMonth() == this.calendarService.currentDate.getMonth()
        )
        this.calendarService.loading = false
        this.changeDetector.detectChanges()
    }
    getContrastColor(hex: string): string {
        return this.calendarService.getContrastColor(hex)
    }
    @HostListener('document:drop')
    private onDrop() {
        this.calendarService.dragged = undefined
    }
    drop(dzien: CalendarDay, event: Event) {
        event.stopPropagation()
        this.calendarService.onDrop(
            new CalendarDropEvent(this.calendarService.dragged!, dzien.date)
        )
        this.calendarService.dragged = undefined
    }

    openDialog(obj: any): void {
        this.detailsData = of(obj.day.entries)
        this.detailsDay = obj.day.date
        this.showDialog = true
    }

    closeDialog(): void {
        this.showDialog = false
    }
}
