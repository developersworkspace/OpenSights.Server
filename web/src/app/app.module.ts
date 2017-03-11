// Imports modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
// import { DatePickerModule } from 'ng2-datepicker';

// Imports Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BiLineChartComponent } from './bi-line-chart/bi-line-chart.component';



let router = RouterModule.forRoot([
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'dashboard/:host',
    component: DashboardComponent
  }
]);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BarChartComponent,
    DashboardComponent,
    BiLineChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    router,
    // DatePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
