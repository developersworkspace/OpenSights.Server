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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private host: string;

  pageViewsByUserAgent: any[] = null;

  constructor(private http: Http, private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.host = params['host'];
      this.loadData();
    });
  }

  loadData() {

    this.http.get(environment.apiUri + '/insights/groupbyuseragent?host=' + this.host)
      .map((res: Response) => res.json())
      .subscribe((result: any[]) => {
        this.pageViewsByUserAgent = result;
      }, (err: Error) => {

      });
  }

}
