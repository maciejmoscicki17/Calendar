import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CalendarService, DataAccessService } from '../../services';
import {
  CalendarDay,
  CalendarDayDetails,
  CalendarTypeEnum,
  CALENDAR_TOKEN,
  CalendarEntry,
  ICalendarService,
} from '../..';
import { Observable, Subscription } from 'rxjs';
import { TranslationsEnum } from '../../models';
import { TranslatorService } from '../../services';

class MonthExtension {
  constructor(
    public date: Date,
    public weeks: Array<CalendarDay>[],
    public name: string
  ) {}
}

@Component({
  selector: 'yearly-view',
  templateUrl: './yearly-view.component.html',
  styleUrls: ['./yearly-view.component.scss', '../../styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearlyViewComponent implements OnInit, OnDestroy {
  private currentYear: Date;
  months: MonthExtension[] = [];
  loading = true;

  showDialog = false;
  detailsData!: Observable<CalendarEntry[]>;
  detailsDay!: Date;

  subs = new Subscription();

  yearlyPreview: Date[] = [];

  get yearDescription(): string {
    return this.currentYear.getFullYear().toString();
  }

  weekLetters = [
    TranslationsEnum.monday,
    TranslationsEnum.tuesday,
    TranslationsEnum.wednesday,
    TranslationsEnum.thursday,
    TranslationsEnum.friday,
    TranslationsEnum.saturday,
    TranslationsEnum.sunday,
  ].map((x) => {
    return this.translatorService.translate(x).substring(0, 1);
  });

  constructor(
    private calendarService: CalendarService,
    private elementRef: ElementRef,
    private translatorService: TranslatorService,
    private changeDetector: ChangeDetectorRef,
    @Inject(CALENDAR_TOKEN)
    private providerService: ICalendarService,
    private dataAccessService: DataAccessService,
    private translationService: TranslatorService
  ) {
    this.currentYear = this.calendarService.currentDate;
    this.subs.add(
      this.calendarService.$dataChanged.subscribe((x) => {
        this.currentYear = this.calendarService.currentDate;
        this.update();
      })
    );
    this.subs.add(
      this.calendarService.$calendarTypeChange.subscribe((x) => {})
    );
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnInit(): void {
    this.loading = true;
    this.update();
  }

  update(): void {
    this.getRoczny().subscribe((x) => {
      this.yearlyPreview = x;
      this.generateYearlyCalendar();
    });
  }

  generateYearlyCalendar(): void {
    let monthCopy = new Date(this.currentYear);
    monthCopy.setMonth(0);
    monthCopy.setDate(1);
    let dateCopy = new Date(this.currentYear);
    this.months = [];
    for (let i = 0; i < 12; i++) {
      dateCopy.setMonth(i);
      dateCopy.setDate(1);
      dateCopy = new Date(
        dateCopy.getTime() -
          (dateCopy.getDay() == 0 ? 6 : dateCopy.getDay() - 1) *
            24 *
            60 *
            60 *
            1000
      );
      let weeks: Array<CalendarDay>[] = [];
      do {
        let week = new Array<CalendarDay>(7);
        for (let j = 0; j < week.length; j++) {
          week[j] = new CalendarDay(dateCopy.getDate(), [], dateCopy);
          dateCopy = new Date(dateCopy.getTime() + 24 * 60 * 60 * 1000);
        }
        weeks.push(week);
      } while (dateCopy.getMonth() == monthCopy.getMonth());
      const name = this.translatorService.translate(
        this.calendarService.months[monthCopy.getMonth()]
      );
      this.months.push(new MonthExtension(new Date(monthCopy), weeks, name));
      monthCopy.setMonth(i + 1);
    }
    console.log('false');
    this.loading = false;
    this.changeDetector.detectChanges();
  }

  public getRoczny() {
    let date = new Date(this.calendarService.currentDate);
    date.setMonth(date.getMonth() + 1);

    return this.providerService.getEventDates(
      date,
      [],
      this.calendarService.currentCalendar
    );
  }

  goToDay(day: CalendarDay): void {
    this.calendarService.goToDay(day.date);
    this.calendarService.changeCalendar(CalendarTypeEnum.daily);
  }

  showDayDetails(day: CalendarDay, event: Event): void {
    event.stopPropagation();
    const element = this.elementRef.nativeElement as HTMLElement;
    const rect = element.getBoundingClientRect();
    let szczegoly = new CalendarDayDetails(day, rect);
    this.calendarService.$showDetailsDialog.next(szczegoly);
  }

  isDayInMonth(day: Date, month: Date): boolean {
    return day.getMonth() === month.getMonth();
  }

  showDetailsDialog(day: Date, event: MouseEvent): void {
    if (this.hasPreview(day)) {
      this.detailsData = this.dataAccessService.getDzienny(day);
      this.detailsDay = day;
      this.showDialog = true;
    }
  }

  hasPreview(date: Date): boolean {
    return this.yearlyPreview.some((x) => {
      let d1 = new Date(x);
      d1.setHours(0, 0, 0, 0);
      let d2 = new Date(date);
      d2.setHours(0, 0, 0, 0);
      return d1.getTime() === d2.getTime();
    });
  }
  isToday(day: CalendarDay): boolean {
    return this.calendarService.isToday(day);
  }
  closeDialog(): void {
    this.showDialog = false;
  }
  goToMonth(month: MonthExtension): void {
    this.calendarService.setParams(month.date);
    this.calendarService.$calendarTypeChange.next(CalendarTypeEnum.monthly);
  }
}
