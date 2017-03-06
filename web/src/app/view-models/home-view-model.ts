// Imports for HTTP requests
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Import environment configuration
import { environment } from './../../environments/environment';

export class HomeViewModel {

    hosts: string[] = ["worldofrations.com", "developersworkspace.co.za"];

    constructor(private http: Http) {
        this.http.get(environment.apiUri + '/insights/hosts')
            .map((res: Response) => res.json())
            .subscribe((result: string[]) => {
                this.hosts = result;
            }, (err: Error) => {

            });
    }

}
