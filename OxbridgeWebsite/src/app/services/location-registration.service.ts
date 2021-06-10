import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Score } from '../models/score';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { apiKey } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationRegistrationService {

  private userLocationRegUrl = "http://localhost:3000/v1/locationRegistrations/";

  //private locationRegUrl = "https://oxbridgecloud.azurewebsites.net/locationRegistrations/";
  constructor(private http: HttpClient, private cookieService:CookieService) { }

  /**
   * Sends a http get request to the backend, in order to get the latest standings in a race
   * @param eventId - The id of the event
   */
  public getLive(_id: string): Observable<Score[]>
  {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<Score[]>(this.userLocationRegUrl+"fromEvent/"+_id, httpOptions).pipe(map(score => { return score['data']}));
  }

  /**
   * Sends a http get request to the backend, in order to get the final scores
   * @param eventId - The id of the event
   */
  public getScoreboard(_id: string): Observable<Score[]>
  {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<Score[]>(this.userLocationRegUrl+"scoreboard/fromEvent/"+_id, httpOptions).pipe(map(score => {return score['data']}));
  }
}
