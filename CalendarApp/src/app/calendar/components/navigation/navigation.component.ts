import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
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

  @Output() viewChange = new EventEmitter<SelectItem<number>>();

  model: any;

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
    const { currentCalendar } = this.calendarService;

    switch (currentCalendar) {
      case CalendarTypeEnum.daily:
      case CalendarTypeEnum.list:
        return `${currentDate.getDate()}.${
          currentDate.getMonth() + 1
        }.${currentDate.getFullYear()}`;
      case CalendarTypeEnum.weekly:
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
  ngOnInit(): void {
    this.subscription.add(
      this.calendarService.$currentDate.subscribe(
        (date) => (this.currentDate = date)
      )
    );
    this.subscription.add(
      this.calendarService.$calendarTypeChange.subscribe((x) => {
        this.dateDescription = this.getDateDescription();
        console.log(x, this.dateDescription);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChange(ev: number) {
    this.viewChange.emit(this.views.find((x) => x.value === ev));
  }

  onLeftButtonClick() {
    this.calendarService.arrowLeft();
  }
  onRightButtonClick() {
    this.calendarService.arrowRight();
  }
}
