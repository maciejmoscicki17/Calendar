import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CalendarService, TranslatorService } from '../../services';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { CalendarTypeEnum, TranslationsEnum } from '../../models';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('1000ms ease-in', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('1000ms ease-in', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('monthContainer', { static: true })
  monthContainer!: ElementRef<HTMLDivElement>;

  model: any;
  showMenu = false;

  dateDescription = this.getDateDescription();

  views = [
    TranslationsEnum.day,
    TranslationsEnum.week,
    TranslationsEnum.month,
    TranslationsEnum.year,
    TranslationsEnum.list,
  ].map((val, ix) => {
    return {
      value: ix,
      label: this.translationService.translate(val),
    } as SelectItem<number>;
  });

  private subscription = new Subscription();
  private currentDate?: Date;

  getDateDescription(): string | undefined {
    if (this.currentDate === undefined) return '';
    const { currentDate } = this;
    const currentCalendar = this.calendarService.$currentCalendar.getValue();
    switch (currentCalendar) {
      case CalendarTypeEnum.daily:
      case CalendarTypeEnum.list:
        return `${currentDate.getDate()}.${
          currentDate.getMonth() + 1
        }.${currentDate.getFullYear()}`;
      case CalendarTypeEnum.weekly:
        return this.getWeeklyDescription(this.currentDate);
      case CalendarTypeEnum.monthly:
        return `${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
      case CalendarTypeEnum.yearly:
        return currentDate.getFullYear().toString();
      default:
        return '';
    }
  }

  constructor(
    private calendarService: CalendarService,
    private translationService: TranslatorService
  ) {
    this.model = this.views[2].value;
  }

  @HostListener('document:click')
  private documentClicked() {
    this.showMenu = false;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.calendarService.$currentDate.subscribe(
        (date) => (this.currentDate = date)
      )
    );
    this.subscription.add(
      this.calendarService.$currentCalendar.subscribe((x) => {
        this.model = x;
        this.updateDayDescription();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChange(ev: number) {
    this.calendarService.$currentCalendar.next(ev);
  }

  onLeftButtonClick() {
    this.calendarService.arrowLeft();
    this.updateDayDescription();
  }
  onRightButtonClick() {
    this.calendarService.arrowRight();
    this.updateDayDescription();
  }

  updateDayDescription(): void {
    this.currentDate = this.calendarService.currentDate;
    this.dateDescription = this.getDateDescription();
  }
  getWeeklyDescription(date: Date): string {
    const currentDate = new Date(date);

    const dayOfWeek = currentDate.getDay();
    const dayDiffToMonday = (dayOfWeek + 6) % 7;

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayDiffToMonday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są od 0 do 11
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }
  closeNavigationCalendar(): void {
    this.documentClicked();
  }
}
