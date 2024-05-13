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
import { CalendarModule as Calendar } from 'primeng/calendar';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonComponent } from './components/button/button.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ListViewComponent } from './components/list-view';
import { FormsModule } from '@angular/forms';
import { MiniYearComponent } from './components/mini-year';
import { YearlyViewComponent } from './components/yearly-view';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import { InputTextModule } from 'primeng/inputtext';
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
    EditDialogComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    SkeletonModule,
    BrowserAnimationsModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    Calendar,
    ColorPickerModule,
    InputTextModule,
  ],
  exports: [CalendarComponent, ButtonComponent],
})
export class CalendarModule {}
