import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { DayOfMonthComponent } from './components/day-of-month/day-of-month.component';
import { DetailsDialogComponent } from './components/details-dialog/details-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { MonthlyViewComponent } from './components/monthly-view/monthly-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonComponent } from './components/button/button.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ListViewComponent } from './components/list-view';
import { FormsModule } from '@angular/forms';
import { MiniYearComponent } from './components/mini-year';
import { YearlyViewComponent } from './components/yearly-view';

@NgModule({
  declarations: [
    CalendarComponent,
    DayOfMonthComponent,
    MonthlyViewComponent,
    DetailsDialogComponent,
    ButtonComponent,
    NavigationComponent,
    ListViewComponent,
    MiniYearComponent,
    YearlyViewComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    SkeletonModule,
    BrowserAnimationsModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
  ],
  exports: [CalendarComponent, ButtonComponent],
})
export class CalendarModule {}
