import { Component, HostListener } from '@angular/core';
import { CalendarService, TranslatorService } from '../../services';
import { TranslationsEnum } from '../../models';
import { CalendarDay, CalendarTypeEnum } from '../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'calendar-mini-year',
  templateUrl: './mini-year.component.html',
  styleUrls: ['./mini-year.component.scss', '../../styles.scss'],
})
export class MiniYearComponent {
  months: string[];

  initialDate: Date;
  currentYear: string;
  currentMonth: string;

  selectedMonth: { month: string; year: string };

  showDailyNavigation = false;

  @HostListener('document:click')
  onClick() {}

  weeks: CalendarDay[][] = [];
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
  subs = new Subscription();

  constructor(
    private calendarService: CalendarService,
    private translatorService: TranslatorService
  ) {
    this.initialDate = new Date(this.calendarService.currentDate);
    if (!this.initialDate) this.initialDate = new Date();
    this.currentYear = this.initialDate.getFullYear().toString();
    this.months = this.calendarService.months.map((x) =>
      this.translatorService.translate(x)
    );
    console.log(this.months);
    this.currentMonth = this.months[this.initialDate.getMonth()];
    this.subs.add(
      this.calendarService.$calendarTypeChange.subscribe((x) => {
        this.showDailyNavigation =
          this.calendarService.currentCalendar === CalendarTypeEnum.daily ||
          this.calendarService.currentCalendar === CalendarTypeEnum.weekly;
      })
    );
    this.updateWeeks();
    this.selectedMonth = {
      month: this.months[this.calendarService.currentDate.getMonth()],
      year: this.calendarService.currentDate.getFullYear().toString(),
    };
  }

  monthClicked(month: string, event: Event) {
    event.stopPropagation();
    this.selectedMonth = { month: month, year: this.currentYear };
    let monthIndex = this.months.findIndex((x) => x === month);
    this.initialDate.setMonth(monthIndex);
    this.currentMonth = this.months[monthIndex];
    this.updateWeeks();
    if (!this.showDailyNavigation) {
      this.updateDate();
      this.calendarService.showDateNavigation(false);
    }
  }

  isCurrentMonth(month: string): boolean {
    let currentMonth = this.calendarService.currentDate;
    return (
      currentMonth.getMonth() === this.months.findIndex((x) => x === month) &&
      currentMonth.getFullYear() === +this.currentYear
    );
  }

  updateDate(): void {
    this.calendarService.setDate(this.initialDate);
  }

  updateYear(): void {
    this.currentYear = this.initialDate.getFullYear().toString();
    this.updateWeeks();
  }

  yearUp(): void {
    this.initialDate.setFullYear(this.initialDate.getFullYear() + 1);
    this.updateYear();
  }

  yearDown(): void {
    this.initialDate.setFullYear(this.initialDate.getFullYear() - 1);
    this.updateYear();
  }

  updateMonth(): void {
    this.currentMonth = this.months[this.initialDate.getMonth()];
  }

  monthUp(): void {
    let month = this.initialDate.getMonth() + 1;
    if (month === 12) {
      this.yearUp();
      month = 0;
    }
    this.initialDate.setMonth(month);
    this.updateMonth();
    this.updateWeeks();
  }

  monthDown(): void {
    let month = this.initialDate.getMonth() - 1;
    if (month === -1) {
      this.yearDown();
      month = 11;
    }
    this.initialDate.setMonth(month);
    this.updateMonth();
    this.updateWeeks();
  }

  updateWeeks(): void {
    let dateCopy = new Date(this.initialDate);
    dateCopy.setDate(1);
    dateCopy = new Date(
      dateCopy.getTime() -
        (dateCopy.getDay() == 0 ? 7 : dateCopy.getDay() - 1) *
          24 *
          60 *
          60 *
          1000
    );
    this.weeks = [];
    do {
      let week = new Array<CalendarDay>(7);
      for (let i = 0; i < week.length; i++) {
        week[i] = new CalendarDay(dateCopy.getDate(), [], dateCopy);
        dateCopy = new Date(dateCopy.getTime() + 24 * 60 * 60 * 1000);
      }
      this.weeks.push(week);
    } while (dateCopy.getMonth() == this.initialDate.getMonth());
  }

  goToDay(day: CalendarDay): void {
    if (this.calendarService.currentCalendar == CalendarTypeEnum.weekly) {
      this.calendarService.goToWeek(day.date);
      return;
    }
    this.calendarService.goToDay(day.date);
    this.initialDate.setFullYear(
      day.date.getFullYear(),
      day.date.getMonth(),
      day.date.getDate()
    );
    this.calendarService.showDateNavigation(false);
  }

  isToday(day: CalendarDay): boolean {
    return this.calendarService.isToday(day);
  }

  isNotInCurrentMonth(day: CalendarDay): boolean {
    return day.date.getMonth() !== this.initialDate.getMonth();
  }

  selectedDay(day: CalendarDay): boolean {
    const d1 = day.date;
    const d2 = this.calendarService.currentDate;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  isSelectedMonth(month: string): boolean {
    return (
      this.selectedMonth.month === month &&
      this.selectedMonth.year === this.currentYear
    );
  }
}
