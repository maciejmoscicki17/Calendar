import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CalendarComponent } from './calendar.component'
import { DayOfMonthComponent } from './components/day-of-month/day-of-month.component'
import { DetailsDialogComponent } from './components/details-dialog/details-dialog.component'
import { DialogModule } from 'primeng/dialog'
import { SkeletonModule } from 'primeng/skeleton'
import { MonthlyViewComponent } from './components/monthly-view/monthly-view.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonModule } from 'primeng/button'
import { ButtonComponent } from './components/button/button.component'
import { NavigationComponent } from './components/navigation/navigation.component'
import { TranslatePipe } from './pipes/translate.pipe'
@NgModule({
    declarations: [
        CalendarComponent,
        DayOfMonthComponent,
        MonthlyViewComponent,
        DetailsDialogComponent,
        ButtonComponent,
        NavigationComponent,
        TranslatePipe,
    ],
    imports: [
        CommonModule,
        DialogModule,
        SkeletonModule,
        BrowserAnimationsModule,
        ButtonModule,
    ],
    exports: [CalendarComponent],
})
export class CalendarModule {}
