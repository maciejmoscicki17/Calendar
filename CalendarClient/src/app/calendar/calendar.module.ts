import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CalendarComponent } from './calendar.component'
import { DayOfMonthComponent } from './components/day-of-month/day-of-month.component'
import { DetailsDialogComponent } from './components/details-dialog/details-dialog.component'
import { DialogModule } from 'primeng/dialog'
import { SkeletonModule } from 'primeng/skeleton'
import { MonthlyViewComponent } from './components/monthly-view/monthly-view.component'
@NgModule({
    declarations: [
        CalendarComponent,
        DayOfMonthComponent,
        MonthlyViewComponent,
        DetailsDialogComponent,
    ],
    imports: [CommonModule, DialogModule, SkeletonModule],
    exports: [CalendarComponent],
})
export class CalendarModule {}
