import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import {
  CalendarService,
  CalendarTypeEnum,
  CALENDAR_TOKEN,
  CalendarEntry,
  ICalendarService,
} from '../..';
import { DataAccessService } from '../../services/';

@Component({
  selector: 'list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListViewComponent implements OnInit {
  @Output() close = new EventEmitter();
  list: CalendarEntry[] = [];

  editing = false;
  editingEntry?: CalendarEntry;

  constructor(
    private calendarService: CalendarService,
    @Inject(CALENDAR_TOKEN)
    private providerService: ICalendarService,
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private dataAccess: DataAccessService
  ) {}
  ngOnInit(): void {
    this.update();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.close.emit();
    event.stopPropagation();
    const el = document.getElementById('list-view-wrapper') as HTMLElement;
    if (this.elementRef.nativeElement.contains(event.target)) this.close.emit();
  }

  update(): void {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    this.dataAccess
      .getEvents(date, CalendarTypeEnum.yearly, [])
      .subscribe((x) => {
        // this.list = x.sort((y, z) => y.start.getTime() - z.start.getTime());
        this.list = x;
        this.changeDetector.detectChanges();
      });
  }

  eventClick(item: CalendarEntry): void {
    this.editing = true;
    this.editingEntry = item;
  }

  repeatedArray(count: number): number[] {
    return Array(count).fill(0);
  }

  getContrastColor(color: string): string {
    return this.calendarService.getContrastColor(color);
  }

  hideDialog() {
    this.editing = false;
    this.editingEntry = undefined;
  }
}
