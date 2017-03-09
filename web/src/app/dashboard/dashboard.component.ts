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

  pageViewsGroupedByPath: any[] = null;
  pageViewsGroupedByUserAgent: any[] = null;
  uniqueUsersGroupedByUserAgent: any[] = null;
  pageViewsGroupedByResolution: any[] = null;
  uniqueUsersGroupedByResolution: any[] = null;
  pageViewsGroupedByLanguage: any[] = null;
  uniqueUsersGroupedByLanguage: any[] = null;
  pageViewsGroupedByPlatform: any[] = null;
  uniqueUsersGroupedByPlatform: any[] = null;
  averagePageLoadTimeGroupedByPath: any[] = null;
  newUsersByHour: any[] = null;
  newUsersByMinute: any[] = null;

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



    this.getData('pageviewsgroupedbyuseragent')
      .subscribe((result: any[]) => {
        this.pageViewsGroupedByUserAgent = result;
      }, (err: Error) => {

      });

    this.getData('uniqueusersgroupedbyuseragent')
      .subscribe((result: any[]) => {
        this.uniqueUsersGroupedByUserAgent = result;
      }, (err: Error) => {

      });

    this.getData('pageviewsgroupedbylanguage')
      .subscribe((result: any[]) => {
        this.pageViewsGroupedByLanguage = result;
      }, (err: Error) => {

      });

    this.getData('uniqueusersgroupedbylanguage')
      .subscribe((result: any[]) => {
        this.uniqueUsersGroupedByLanguage = result;
      }, (err: Error) => {

      });

    this.getData('pageviewsgroupedbyresolution')
      .subscribe((result: any[]) => {
        this.pageViewsGroupedByResolution = result;
      }, (err: Error) => {

      });

    this.getData('uniqueusersgroupedbyresolution')
      .subscribe((result: any[]) => {
        this.uniqueUsersGroupedByResolution = result;
      }, (err: Error) => {

      });

    this.getData('pageviewsgroupedbypath')
      .subscribe((result: any[]) => {
        this.pageViewsGroupedByPath = result;
      }, (err: Error) => {

      });

    this.getData('pageviewsgroupedbyplatform')
      .subscribe((result: any[]) => {
        this.pageViewsGroupedByPlatform = result;
      }, (err: Error) => {

      });

    this.getData('uniqueusersgroupedbyplatform')
      .subscribe((result: any[]) => {
        this.uniqueUsersGroupedByPlatform = result;
      }, (err: Error) => {

      });

    this.getData('averagepageloadtimebygroupedpath')
      .subscribe((result: any[]) => {
        this.averagePageLoadTimeGroupedByPath = result;
      }, (err: Error) => {

      });

    this.getData('newusersbyhour')
      .subscribe((result: any[]) => {
        this.newUsersByHour = result;
      }, (err: Error) => {

      });

    this.getData('newusersbyminute')
      .subscribe((result: any[]) => {
        this.newUsersByMinute = result;
      }, (err: Error) => {

      });
  }

  private getData(uri: string) {

    let fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 2);

    let toDate = new Date();
    toDate.setHours(23, 59, 59, 999);

    return this.http.get(environment.apiUri + '/insights/' + uri + '?host=' + this.host + '&fromDate=' + this.getUTCSeconds(fromDate) + '&toDate=' + this.getUTCSeconds(toDate))
      .map((res: Response) => res.json());
  }

  private getUTCSeconds(dateTime) {
    var UTCseconds = (dateTime.getTime() + dateTime.getTimezoneOffset() * 60 * 1000) / 1000;

    return UTCseconds;
  }

}
