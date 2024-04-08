import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core'
import { CalendarService } from '../../services'
import {
    CalendarDay,
    CalendarDayDetails,
    CalendarEntry,
    CalendarSettings,
    TranslationsEnum,
} from '../../models'
import { Subscription } from 'rxjs'

@Component({
    selector: '[day-of-month]',
    templateUrl: './day-of-month.component.html',
    styleUrls: ['./day-of-month.component.scss', '../../styles.scss'],
})
export class DayOfMonthComponent implements OnInit, OnDestroy {
    private subs = new Subscription()
    @Input('day') day!: CalendarDay

    @Output('openDialog') openDetailsDialog = new EventEmitter<any>()

    @HostListener('document:contextmenu', ['$event'])
    rightClick(event: Event) {
        event.preventDefault()
    }

    visibleEvents = 4
    setDay(): void {
        this.calendarService.setDay(this.day)
    }
    @Output('onClick') onClick = new EventEmitter<CalendarEntry>()

    constructor(
        private calendarService: CalendarService,
        private elementRef: ElementRef,
        private changeDetector: ChangeDetectorRef
    ) {}
    ngOnInit(): void {
        this.subs.add(
            this.calendarService.$eventVisibilityChange.subscribe((x) => {
                this.visibleEvents = x
                this.changeDetector.detectChanges()
            })
        )
        this.subs.add(
            this.calendarService.$settingsChanged.subscribe(
                (s: CalendarSettings) => {
                    this.visibleEvents = s.visibleEventCount + 1
                }
            )
        )
    }
    ngOnDestroy(): void {
        this.subs.unsubscribe()
    }
    readonly translationsEnum = TranslationsEnum

    dragStart(data: CalendarEntry): void {
        this.calendarService.onDragStart(data)
        this.changeDetector.detectChanges()
    }

    getContrastColor(hex: string): string {
        return this.calendarService.getContrastColor(hex)
    }

    isToday(): boolean {
        return this.calendarService.isToday(this.day)
    }

    showDayDetails(event: Event): void {
        event.stopPropagation()
        const element = this.elementRef.nativeElement as HTMLElement
        const rect = element.getBoundingClientRect()
        let szczegoly = new CalendarDayDetails(this.day, rect)
        this.calendarService.showDayDetails(szczegoly)
    }
    click(data: CalendarEntry): void {
        console.error('Click not implemented in DayOfMonth')
    }
    isCurrentMonth(): boolean {
        if (!this.day || !this.day.date) return false
        if (this.calendarService.loading) return true
        return (
            this.day.date.getMonth() ===
            this.calendarService.currentDate.getMonth()
        )
    }

    goToDay(): void {
        this.calendarService.currentDaySelection = this.day
        this.calendarService.currentDate = this.day.date
        this.calendarService.goToDayView()
    }

    openDialog(day: CalendarDay, event: MouseEvent): void {
        this.openDetailsDialog.next({ day, event })
    }
}
