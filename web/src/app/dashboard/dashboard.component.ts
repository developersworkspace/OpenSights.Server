// Imports
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Imports for HTTP requests
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Import environment configuration
import { environment } from './../../environments/environment';

// Imports components
// import { DatePickerOptions, DateModel } from 'ng2-datepicker';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private host: string;

  pageViewsByPath: any[] = null;
  pageViewsByUserAgent: any[] = null;
  pageViewsByResolution: any[] = null;
  pageViewsByLanguage: any[] = null;
  pageViewsByPlatform: any[] = null;
  averagePageLoadTimeByPath: any[] = null;

  // fromDate: DateModel;
  // toDate: DateModel;
  // options: DatePickerOptions;

  constructor(private http: Http, private route: ActivatedRoute) {
    // this.options = new DatePickerOptions({
    //   initialDate: new Date()
    // });
  }

  // onChange_Dates(obj: any) {
  //   if (obj.data instanceof Object) {
  //     this.loadData();
  //   }
  // }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.host = params['host'];
      this.loadData();
    });
  }

  loadData() {

    // if (this.fromDate == null || this.toDate == null) {
    //   return;
    // }

    // let fromDate = new Date(this.fromDate.formatted);
    // let toDate = new Date(this.toDate.formatted);
    // toDate.setHours(23, 59, 59, 999);

    let fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 2);

    let toDate = new Date();
    toDate.setHours(23, 59, 59, 999);


    this.http.get(environment.apiUri + '/insights/groupbyuseragent?host=' + this.host + '&fromDate=' + this.getUTCSeconds(fromDate) + '&toDate=' + this.getUTCSeconds(toDate))
      .map((res: Response) => res.json())
      .subscribe((result: any[]) => {
        this.pageViewsByUserAgent = result;
      }, (err: Error) => {

      });

    this.http.get(environment.apiUri + '/insights/groupbylanguage?host=' + this.host + '&fromDate=' + this.getUTCSeconds(fromDate) + '&toDate=' + this.getUTCSeconds(toDate))
      .map((res: Response) => res.json())
      .subscribe((result: any[]) => {
        this.pageViewsByLanguage = result;
      }, (err: Error) => {

      });


    this.http.get(environment.apiUri + '/insights/groupbyresolution?host=' + this.host + '&fromDate=' + this.getUTCSeconds(fromDate) + '&toDate=' + this.getUTCSeconds(toDate))
      .map((res: Response) => res.json())
      .subscribe((result: any[]) => {
        this.pageViewsByResolution = result;
      }, (err: Error) => {

      });

    this.http.get(environment.apiUri + '/insights/groupbypath?host=' + this.host + '&fromDate=' + this.getUTCSeconds(fromDate) + '&toDate=' + this.getUTCSeconds(toDate))
      .map((res: Response) => res.json())
      .subscribe((result: any[]) => {
        this.pageViewsByPath = result;
      }, (err: Error) => {

      });

    this.http.get(environment.apiUri + '/insights/groupbyplatform?host=' + this.host + '&fromDate=' + this.getUTCSeconds(fromDate) + '&toDate=' + this.getUTCSeconds(toDate))
      .map((res: Response) => res.json())
      .subscribe((result: any[]) => {
        this.pageViewsByPlatform = result;
      }, (err: Error) => {

      });

    this.http.get(environment.apiUri + '/insights/averagepageloadtimebypath?host=' + this.host + '&fromDate=' + this.getUTCSeconds(fromDate) + '&toDate=' + this.getUTCSeconds(toDate))
      .map((res: Response) => res.json())
      .subscribe((result: any[]) => {
        this.averagePageLoadTimeByPath = result;
      }, (err: Error) => {

      });
  }

  private getUTCSeconds(dateTime) {
    var UTCseconds = (dateTime.getTime() + dateTime.getTimezoneOffset() * 60 * 1000) / 1000;

    return UTCseconds;
  }

}
