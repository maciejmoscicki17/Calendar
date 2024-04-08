import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CalendarService } from '../../services';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { CalendarTypeEnum } from '../../models';

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
export class NavigationComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('monthContainer', { static: true })
  monthContainer!: ElementRef<HTMLDivElement>;
  monthElements: string[] = ['Month 0', 'Month 1', 'Month 2'];
  el1: string[] = ['Month 0'];
  el2: string[] = ['Month 0', 'Month 1'];

  model: any;

  options: SelectItem<any>[];

  private subscription = new Subscription();
  private currentDate?: Date;

  get dateDescription(): string | undefined {
    const dateString = this.currentDate?.getMonth();
    return dateString?.toString();
  }

  currentIndex = 1; // Start with the middle element as active

  constructor(private calendarService: CalendarService) {
    const types = this.enumToSelectItems(CalendarTypeEnum);
    this.options = types;
    this.model = this.options[2].value;
  }
  ngOnInit(): void {
    this.subscription.add(
      this.calendarService.$currentDate.subscribe(
        (date) => (this.currentDate = date)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fade = false;

  ngAfterViewInit(): void {
    // this.updateStyles()
  }

  onClick() {
    // Update the currentIndex and trigger the animation
    // const temp = (this.currentIndex + 1) % this.monthElements.length
    const temparr = [...this.monthElements];
    temparr.push(temparr.shift() as string);
    this.monthElements = temparr;
    // this.currentIndex = (this.currentIndex + 1) % this.monthElements.length
    // this.updateStyles()
  }

  updateStyles() {
    setTimeout(() => {
      if (this.monthElements[0]) {
      }
    }, 200);
  }

  onLeftButtonClick() {
    this.calendarService.arrowLeft();
  }
  onRightButtonClick() {
    this.calendarService.arrowRight();
  }

  enumToSelectItems(enumObject: any): SelectItem<number>[] {
    return Object.keys(enumObject)
      .filter((key) => isNaN(Number(enumObject[key])))
      .map((key) => ({
        label: enumObject[key],
        value: +key,
      }));
  }
}
