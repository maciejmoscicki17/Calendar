import { Component, OnInit, Inject, Input } from '@angular/core';
import { CalendarService, DataAccessService } from './services';
import { CALENDAR_TOKEN, CalendarTypeEnum, ICalendarService } from './models';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [CalendarService, DataAccessService],
})
export class CalendarComponent implements OnInit {
  @Input()
  language!: Observable<'en' | 'pl'>;
  @Input() loading!: BehaviorSubject<boolean>;

  currentView: number = 2;
  constructor(
    @Inject(CALENDAR_TOKEN)
    private providerService: ICalendarService,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.loading.next(true);
    this.providerService
      .getEvents(new Date(), new Date(), [], CalendarTypeEnum.daily)
      .subscribe((x) => {
        this.calendarService.data = x;
        this.calendarService.$dataChanged.next(null);
        this.loading.next(false);
      });
    this.language.subscribe((lang) => {
      console.warn('lang', lang);
    });
  }

  onViewChange(si: SelectItem<number>) {
    this.currentView = si.value;
    console.warn('viewChange');
    this.calendarService.currentCalendar = si.value;
    this.calendarService.$calendarTypeChange.next(si.value);
    // let dateStr = new Date(Date.now()).toDateString();
    // this.providerService
    //   .postEvent({
    //     color: 'red',
    //     description: 'aha aha',
    //     start: dateStr,
    //     end: dateStr,
    //     tooltip: '',
    //   })
    //   .subscribe((x) =>
    //     this.providerService
    //       .getEvents(new Date(), new Date(), [], CalendarTypeEnum.daily)
    //       .subscribe((x) => {
    //         this.calendarService.data = x;
    //         this.calendarService.$dataChanged.next(null);
    //         this.loading.next(false);
    //       })
    //   );
  }
}
