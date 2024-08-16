import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import {
  CalendarEntry,
  CalendarDay,
  CalendarService,
  EntryExtension,
  CalendarSettings,
} from '../..';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dialy-view, [daily-view]',
  templateUrl: './daily-view.component.html',
  styleUrls: ['./daily-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialyViewComponent implements OnInit {
  isWeekView = false;
  intervalHeight = 30;
  private result: CalendarEntry[][] = [];
  private cardWidth: number = 0;
  intervalArray: Array<any> = [];
  eventWidth = '50px';
  firstLoad = false;
  @Input('hideHours') hideHours = false;
  @Input('daily-view') day!: CalendarDay;

  ext: EntryExtension[] = [];
  hours = new Array<number>();

  get minuteInterval(): number {
    return this.calendarService.getSettings().timeInterval;
  }

  private sub = new Subscription();

  constructor(
    private calendarService: CalendarService,
    private changeDetector: ChangeDetectorRef
  ) {
    for (let i: number = 0; i < 24; i++) {
      this.hours.push(i);
    }
  }

  ngOnInit(): void {
    this.isWeekView = this.day !== undefined;
    if (this.calendarService.$currentCalendar.getValue() === 0) {
      this.setupDay();
    }
    this.calendarService.$triggerLoader.next(true);
    this.sub.add(
      this.calendarService.$dataChanged.subscribe(() => {
        this.update();
        this.changeDetector.detectChanges();
      })
    );
    if (this.day === undefined) {
      let data = new Date();
      this.day = new CalendarDay(data.getDate(), [], data);
    }
    this.calendarService.$triggerLoader.next(false);
    this.sub.add(
      this.calendarService.$settingsChanged.subscribe((s: CalendarSettings) => {
        this.intervalHeight = s.intervalHeight;
        this.update();
      })
    );
    this.update();
  }

  setupDay() {
    this.day = this.calendarService.currentDaySelection;
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateWidth();
    this.ext.forEach((e) => {
      e.left = this.calculateLeft(e.entry) + 'px';
    });
    this.changeDetector.detectChanges();
  }

  private transformEventArray(events: CalendarEntry[]): CalendarEntry[][] {
    const eventArray: CalendarEntry[][] = [];
    events.forEach((ev) => {
      let added = false;
      for (let i = 0; i < eventArray.length; i++) {
        const eventColumn = eventArray[i];
        if (!eventColumn.some((entry) => this.dateOverlap(entry, ev))) {
          eventColumn.push(ev);
          added = true;
          break;
        }
      }

      if (!added) {
        eventArray.push([ev]);
      }
    });

    return eventArray;
  }
  private update() {
    this.calendarService.$triggerLoader.next(true);
    this.intervalArray = new Array(60 / this.minuteInterval);
    if (!this.isWeekView) {
      this.day = this.calendarService.currentDaySelection;
    }
    let temp: CalendarEntry[] = [];
    for (let zlecenie of this.day.entries) {
      temp.push(zlecenie);
    }
    this.result = this.transformEventArray(this.day.entries);
    this.cardWidth = this.calculateWidth();
    let tb: EntryExtension[] = [];
    for (let row of this.result) {
      for (let cell of row) {
        tb.push(
          new EntryExtension(
            cell,
            this.cardWidth,
            this.calculateLeft(cell),
            this.calculateTop(cell),
            this.calculateHeight(cell)
          )
        );
      }
    }
    this.ext = tb;
    this.calendarService.$triggerLoader.next(false);
    this.firstLoad = true;
    this.changeDetector.detectChanges();
  }
  private dateOverlap(ev1: CalendarEntry, ev2: CalendarEntry) {
    return ev1.start <= ev2.end && ev1.end >= ev2.start;
  }
  private intervalsPassed(start: Date, end: Date): number {
    let startOfDayDate = new Date(this.day.date);
    startOfDayDate.setHours(0, 0, 0, 0);
    if (start < startOfDayDate) start = startOfDayDate;

    let endOfDayDate = new Date(this.day.date);
    endOfDayDate.setHours(23, 59, 59, 999);
    if (end > endOfDayDate) end = endOfDayDate;

    const timeDifference = Math.abs(start.getTime() - end.getTime());
    return timeDifference / (this.minuteInterval * 60 * 1000);
  }
  private isAllDay(start: Date, end: Date): boolean {
    let startOfDay = new Date(this.day.date);
    startOfDay.setHours(0, 0, 0, 0);

    let endOfDay = new Date(this.day.date);
    endOfDay.setHours(23, 59, 59, 999);

    if (start > startOfDay || end < endOfDay) return false;
    else return true;
  }
  private calculateTop(event: CalendarEntry): number {
    if (this.isAllDay(new Date(event.start), new Date(event.end))) return 0;
    let startOfDayDate = new Date(this.day.date);
    startOfDayDate.setHours(0, 0, 0, 0);
    if (new Date(event.start) < startOfDayDate) return 0;
    const startDate = event.start;
    const midnight = new Date(startDate);
    midnight.setHours(0, 0, 0, 0);
    const intervals = this.intervalsPassed(new Date(startDate), midnight);
    return intervals * this.intervalHeight;
  }
  private calculateWidth(): number {
    const background = document.getElementById('background');
    if (background === null) return 0;
    const offset = this.hideHours ? 0 : 20;
    const width = background.offsetWidth;
    this.eventWidth = (width - offset) / this.result.length + 'px';
    return (width - offset) / this.result.length;
  }
  private calculateLeft(event: CalendarEntry): number {
    let index = -1;
    for (let i = 0; i < this.result.length; i++) {
      if (this.result[i].includes(event)) index = i;
    }
    let width = this.calculateWidth();
    let offset = this.hideHours ? 0 : 20;
    return width * index + offset;
  }
  private calculateHeight(event: CalendarEntry): number {
    if (this.isAllDay(new Date(event.start), new Date(event.end)))
      return (
        this.intervalHeight *
        this.intervalsPassed(new Date(event.start), new Date(event.end))
      );
    let endOfDayDate = new Date(this.day.date);
    endOfDayDate.setHours(23, 59, 59, 999);
    if (new Date(event.end) > endOfDayDate) {
      return (
        this.intervalsPassed(new Date(event.start), endOfDayDate) *
        this.intervalHeight
      );
    }

    return (
      this.intervalsPassed(new Date(event.start), new Date(event.end)) *
      this.intervalHeight
    );
  }
  onClick(event: CalendarEntry): void {
    console.error('Click not implemented');
    // event.actionButtons[0].clickEvent.emit();
  }

  dragStart(event: EntryExtension) {
    this.calendarService.onDragStart(event.entry, this.day.date);
  }
  timeMarkerPosition(): string {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const now = new Date();
    const ints = this.intervalsPassed(midnight, now);
    return (ints * this.intervalHeight).toString() + 'px';
  }
  isToday(): boolean {
    return this.calendarService.isToday(this.day);
  }
  getContrastColor(hex: string): string {
    return this.calendarService.getContrastColor(hex);
  }

  getDayOfWeek(date: Date): string {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  }
}
