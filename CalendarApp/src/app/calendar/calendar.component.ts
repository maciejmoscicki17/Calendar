import { Component, OnInit, Inject, Input } from '@angular/core';
import { CalendarService, DataAccessService } from './services';
import { CALENDAR_TOKEN, CalendarTypeEnum, ICalendarService } from './models';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
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

  subscription = new Subscription();

  currentView: number = 2;
  constructor(
    @Inject(CALENDAR_TOKEN)
    private providerService: ICalendarService,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.calendarService.$currentCalendar.subscribe((x) => {
        this.currentView = x;
      })
    );
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

  onViewChange(si: any) {
    this.currentView = si.value;
    this.calendarService.$currentCalendar.next(si.value);
  }
}
