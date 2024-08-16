import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  CalendarTypeEnum,
  CalendarEntry,
  TranslationsEnum,
} from '../../models';

import { Observable, Subscription, of } from 'rxjs';
import { CalendarService } from '../../services';
@Component({
  selector: 'details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss', '../../styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsDialogComponent implements OnInit {
  showPDialog = true;
  hideOnDrag = false;

  translationsEnum = TranslationsEnum;

  subs = new Subscription();

  @Input('data') data!: Observable<CalendarEntry[]>;
  @Input('day') day!: Date;
  @Output('onHide') onHide = new EventEmitter();

  editing = false;
  editingEntry?: CalendarEntry;

  readonly days = [
    TranslationsEnum.monday,
    TranslationsEnum.tuesday,
    TranslationsEnum.wednesday,
    TranslationsEnum.thursday,
    TranslationsEnum.friday,
    TranslationsEnum.saturday,
    TranslationsEnum.sunday,
  ];

  constructor(
    private calendarService: CalendarService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.showPDialog = true;
  }

  ngOnInit(): void {}
  visible = false;
  showDialog() {
    this.visible = true;
  }

  generateDayDescription(): string {
    return `${this.day.getDate()}.${
      this.day.getMonth() + 1
    }.${this.day.getFullYear()}`;
  }

  getContrastColor(color: string): string {
    return this.calendarService.getContrastColor(color);
  }

  onClick(event: CalendarEntry, ev: Event): void {
    ev.stopPropagation();
    this.editingEntry = event;
    this.editing = true;
  }

  dragStart(ev: CalendarEntry) {
    this.showPDialog = false;
    this.calendarService.onDragStart(ev, new Date());
    this.hideOnDrag = true;
    this.changeDetector.detectChanges();
  }

  dragEnd(ev: any) {
    this.showPDialog = true;
    this.changeDetector.detectChanges();
  }

  goToDay(day: Date): void {
    this.calendarService.goToDay(day);
    this.calendarService.changeCalendar(CalendarTypeEnum.daily);
  }

  closeDialog(): void {
    this.onHide.emit();
  }

  repeatedArray(count: number): number[] {
    return Array(count).fill(0);
  }

  hideDialog() {
    this.editing = false;
    this.editingEntry = undefined;
  }
}
