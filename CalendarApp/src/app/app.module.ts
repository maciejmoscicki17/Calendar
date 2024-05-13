import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule } from './calendar/calendar.module';
import { DemoComponent } from './components/demo/demo.component';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [AppComponent, DemoComponent, LoaderComponent],
  imports: [BrowserModule, AppRoutingModule, CalendarModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
