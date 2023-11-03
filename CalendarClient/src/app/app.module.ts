import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SidePanelComponent } from './side-panel/side-panel.component'
import { CalendarModule } from './calendar/calendar.module';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoaderComponent } from './loader/loader.component'
@NgModule({
    declarations: [AppComponent, SidePanelComponent, HomeComponent, NotFoundComponent, LoaderComponent],
    imports: [BrowserModule, AppRoutingModule, CalendarModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
