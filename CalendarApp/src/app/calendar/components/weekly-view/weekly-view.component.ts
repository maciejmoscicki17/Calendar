import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CalendarDay } from '../../models';
import { CalendarService, DataAccessService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'weekly-view',
  templateUrl: './weekly-view.component.html',
  styleUrls: ['./weekly-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyViewComponent implements OnInit, OnDestroy {
  data: CalendarDay[] = [];
  currentDate = new Date();

  subs = new Subscription();

  constructor(
    private calendarService: CalendarService,
    private changeDetector: ChangeDetectorRef,
    private dataAccessService: DataAccessService
  ) {}
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnInit(): void {
    this.subs.add(
      this.calendarService.$changeWeek.subscribe((z) => {
        this.update();
      })
    );
    this.update();
  }

  update(): void {
    let date = new Date(this.calendarService.currentDate);
    let initDate = this.calendarService.findPreviousMonday(date);
    this.data = [];
    this.dataAccessService.getWeekly(initDate).subscribe((y) => {
      do {
        let startDate = new Date(initDate);
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        this.data.push(
          new CalendarDay(
            initDate.getDate(),
            y.filter((x) => {
              return (
                new Date(x.start) <= endDate && new Date(x.end) >= startDate
              );
            }),
            new Date(initDate)
          )
        );
        initDate.setDate(initDate.getDate() + 1);
      } while (initDate.getDay() !== 1);
      this.changeDetector.detectChanges();
    });
  }
}
