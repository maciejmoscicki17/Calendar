import { Component, OnInit, Inject, Input } from '@angular/core';
import { CalendarService, DataAccessService } from './services';
import { CALENDAR_TOKEN, CalendarTypeEnum, ICalendarService } from './models';
import { BehaviorSubject, Observable } from 'rxjs';

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
        console.warn(x);
        this.calendarService.data = x;
        this.calendarService.$dataChanged.next(null);
        this.loading.next(false);
      });
    this.language.subscribe((lang) => {
      console.error('lang', lang);
    });
  }
}
