import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import {
  CalendarDay,
  CalendarDayDetails,
  CalendarTypeEnum,
  CALENDAR_TOKEN,
  CalendarDropEvent,
  CalendarEntry,
  CalendarSettings,
  ICalendarService,
  TranslationsEnum,
} from '../models';
import { DataAccessService } from '.';
import { ColorsService } from './colors.service';

@Injectable()
export class CalendarService implements OnDestroy {
  showDetails = false;
  currentDaySelection: CalendarDay;
  public $detailedViewChange = new Subject<CalendarDayDetails>();
  public $showDetailsDialog = new Subject<CalendarDayDetails>();
  public $dataChanged = new Subject();
  public $triggerLoader = new BehaviorSubject<boolean>(false);
  public $eventVisibilityChange = new BehaviorSubject<number>(
    this.getVisibleEvents()
  );
  public $dateNavigationChange = new BehaviorSubject<boolean>(false);
  public $changeWeek = new Subject<Date>();

  data: CalendarEntry[] = [];
  private readonly sub = new Subscription();
  loading = false;
  $currentCalendar = new BehaviorSubject<CalendarTypeEnum>(
    CalendarTypeEnum.monthly
  );
  dragged: CalendarEntry | undefined;
  dragStartDate: Date | undefined = undefined;
  lastRequest: Subscription | undefined;
  private visibleEvents = 3;
  private showDateNav = false;

  currentDate = new Date();
  private _currentDate: BehaviorSubject<Date>;

  get $currentDate(): Observable<Date> {
    return this._currentDate.asObservable();
  }

  private settings = new CalendarSettings();
  public $settingsChanged = new BehaviorSubject(this.settings);

  readonly months = [
    TranslationsEnum.january,
    TranslationsEnum.february,
    TranslationsEnum.march,
    TranslationsEnum.april,
    TranslationsEnum.may,
    TranslationsEnum.june,
    TranslationsEnum.july,
    TranslationsEnum.august,
    TranslationsEnum.september,
    TranslationsEnum.october,
    TranslationsEnum.november,
    TranslationsEnum.december,
  ];

  get intervalHeight() {
    return this.settings.intervalHeight;
  }

  constructor(
    @Inject(CALENDAR_TOKEN)
    private providerService: ICalendarService,
    private dataAccess: DataAccessService,
    private colorsService: ColorsService
  ) {
    this.settings = new CalendarSettings();
    const date = new Date();
    this.currentDaySelection = new CalendarDay(date.getDate(), [], date);
    this.getData();
    this._currentDate = new BehaviorSubject<Date>(this.currentDate);
  }

  setParams(date: Date, calendarType = CalendarTypeEnum.monthly) {
    this.currentDate = date;
    this.$currentCalendar.next(calendarType);
    this.getData();
  }

  public changeCalendar(type: CalendarTypeEnum): void {
    this.$currentCalendar.next(type);
    this.getData();
  }

  public getData(): void {
    this.loading = true;
    this.$triggerLoader.next(true);
    if (this.lastRequest) {
      this.lastRequest.unsubscribe();
    }
    this.lastRequest = new Subscription();
    this.lastRequest.add(
      this.dataAccess
        .getEvents(this.currentDate, this.$currentCalendar.getValue(), [])
        .subscribe((x) => {
          this.data = x;
          this.updateCurrentDaySelection(this.currentDate);
          this.$triggerLoader.next(false);
          this.$dataChanged.next(true);
        })
    );
  }

  showDayDetails(dayDetails: CalendarDayDetails): void {
    this.currentDaySelection = dayDetails.day;
    this.showDetails = true;
    this.$detailedViewChange.next(dayDetails);
  }

  showDetailsDialog(details: CalendarDayDetails): void {
    this.currentDaySelection = details.day;
    this.$showDetailsDialog.next(details);
  }

  isToday(day: CalendarDay): boolean {
    return new Date().toDateString() === day.date.toDateString();
  }

  getContrastColor(hex: string): string {
    if (hex.charAt(0) !== '#') {
      hex = this.colorsService.getColor(hex);
    }
    var hexColor = hex.substring(1);
    const radix = 16;
    var r = parseInt(hexColor.substring(0, 2), radix);
    var g = parseInt(hexColor.substring(2, 4), radix);
    var b = parseInt(hexColor.substring(4, 6), radix);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 130 ? 'black' : 'white';
  }
  setDay(day: CalendarDay): void {
    this.currentDaySelection = day;
    this.$detailedViewChange.next(
      new CalendarDayDetails(this.currentDaySelection, new DOMRect())
    );
  }

  formatTooltipDescription(data: CalendarEntry): string {
    return (
      data.description +
      '\nOd: ' +
      data.start.toLocaleString() +
      '\nDo: ' +
      data.end.toLocaleString()
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onDragStart(e: CalendarEntry, startDate: Date) {
    this.dragged = e;
    this.dragStartDate = startDate;
  }

  onDrop(e: CalendarDropEvent): void {
    if (this.dragStartDate === undefined) {
      return;
    }
    if (this.areSameDay(e.from, e.to)) {
      return;
    }

    this.providerService.onDrop(e).subscribe((x) => {
      this.data = x;
      this.$dataChanged.next(true);
    });
  }

  areSameDay(date1: Date, date2: Date): boolean {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    return year1 === year2 && month1 === month2 && day1 === day2;
  }

  goToDay(data: Date = new Date()): void {
    this.currentDate = data;
    this.updateCurrentDaySelection(this.currentDate);
    this.goToDayView();
  }

  goToWeek(data: Date = new Date()): void {
    this.currentDate = data;
    this.$changeWeek.next(data);
  }

  arrowLeft(): void {
    switch (this.$currentCalendar.getValue()) {
      case CalendarTypeEnum.monthly:
        this.previousMonth();
        break;
      case CalendarTypeEnum.daily:
        this.previousDay();
        break;
      case CalendarTypeEnum.yearly:
        this.previousYear();
        break;
      case CalendarTypeEnum.weekly:
        this.previousWeek();
        break;
    }
    this.getData();
  }
  arrowRight(): void {
    switch (this.$currentCalendar.getValue()) {
      case CalendarTypeEnum.monthly:
        this.nextMonth();
        break;
      case CalendarTypeEnum.daily:
        this.nextDay();
        break;
      case CalendarTypeEnum.yearly:
        this.nextYear();
        break;
      case CalendarTypeEnum.weekly:
        this.nextWeek();
        break;
    }
    this.getData();
  }

  previousMonth(): void {
    this.currentDate.setDate(1);
    if (this.currentDate.getMonth() == 0) {
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
      this.currentDate.setMonth(11);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    }
  }
  previousDay(): void {
    let d = this.currentDaySelection.date;
    let nd = d.getDate() - 1;
    const month = d.getMonth();
    if (nd === 0) {
      if ([0, 1, 3, 5, 7, 8, 10].includes(month)) {
        this.previousMonth();
        nd = 31;
      } else if ([4, 6, 9, 11].includes(month)) {
        this.previousMonth();
        nd = 30;
      } else if (month == 2) {
        this.previousMonth();
        nd = 28;
      }
    }

    let prevDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      nd
    );
    this.currentDate = prevDay;
    this.getData();
  }
  previousYear(): void {
    this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
    this.$dataChanged.next(this.currentDate);
  }

  previousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.$changeWeek.next(this.currentDate);
  }

  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.$changeWeek.next(this.currentDate);
  }

  nextMonth(): void {
    if (this.currentDate.getMonth() == 11) {
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
      this.currentDate.setMonth(0);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    }
  }

  nextDay(): void {
    let d = this.currentDaySelection.date;
    let nd = d.getDate() + 1;
    const month = d.getMonth();
    if (nd === 32 && [0, 2, 4, 6, 7, 9, 11].includes(month)) {
      this.currentDate.setDate(1);
      this.nextMonth();
    } else if (nd === 31 && [3, 5, 8, 10].includes(month)) {
      this.currentDate.setDate(1);
      this.nextMonth();
    } else if (nd == 29 && month == 1) {
      this.currentDate.setDate(1);
      this.nextMonth();
    } else {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }

    this.getData();
  }
  nextYear(): void {
    this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
    this.$dataChanged.next(this.currentDate);
  }

  setMonth(index: number): void {
    this.currentDate.setMonth(index);
    this.getData();
  }

  setYear(year: number): void {
    this.currentDate.setFullYear(year);
    this.getData();
  }

  setDate(date: Date): void {
    this.currentDate.setFullYear(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    this.getData();
  }

  setVisibleEvents(val: number): void {
    this.visibleEvents = val + 1;
    this.$eventVisibilityChange.next(this.visibleEvents);
  }

  getVisibleEvents(): number {
    return this.visibleEvents ?? 3;
  }

  getCalendarDescription(): string {
    let value = '';
    if (this.$currentCalendar.getValue() === CalendarTypeEnum.daily)
      value += this.currentDaySelection.number + ' ';

    return (value +=
      this.currentDate.getMonth() + 1 + ' ' + this.currentDate.getFullYear());
  }

  goToDayView(): void {
    this.changeCalendar(CalendarTypeEnum.daily);
  }
  goToMonthView(): void {
    this.changeCalendar(CalendarTypeEnum.monthly);
  }

  setCalendarSettings(settings: CalendarSettings) {
    this.settings = settings;
    this.$settingsChanged.next(settings);
  }
  getSettings(): CalendarSettings {
    return this.settings;
  }
  showDateNavigation(value: boolean): void {
    this.showDateNav = value;
    this.$dateNavigationChange.next(this.showDateNav);
  }

  findPreviousMonday(inputDate: Date): Date {
    const weekday = inputDate.getDay();

    if (weekday === 1) {
      return inputDate;
    }

    const daysToSubtract = weekday === 0 ? 6 : weekday - 1;
    const previousMonday = new Date(inputDate);
    previousMonday.setDate(inputDate.getDate() - daysToSubtract);

    return previousMonday;
  }

  updateCurrentDaySelection(date: Date) {
    let startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    this.currentDaySelection = new CalendarDay(
      date.getDate(),
      this.data.filter((x) => {
        return new Date(x.start) <= endDate && new Date(x.end) >= startDate;
      }),
      date
    );
  }
}
