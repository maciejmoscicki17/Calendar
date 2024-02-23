import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SidePanelComponent } from './side-panel/side-panel.component'
import { CalendarModule } from './calendar/calendar.module'
import { HomeComponent } from './home/home.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { LoaderComponent } from './loader/loader.component'
import { DemoComponent } from './demo/demo.component'
import { HttpClientModule } from '@angular/common/http'
@NgModule({
    declarations: [
        AppComponent,
        SidePanelComponent,
        HomeComponent,
        NotFoundComponent,
        LoaderComponent,
        DemoComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CalendarModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
