// Imports
import { Component, OnInit } from '@angular/core';

// Imports for HTTP requests
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Imports models
import { HomeViewModel } from './../view-models/home-view-model'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

   viewModel: HomeViewModel = null;

  constructor(http: Http) {
    this.viewModel = new HomeViewModel(http);
   }

  ngOnInit() {
  }

}
