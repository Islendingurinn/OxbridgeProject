import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CheckPoint } from '../models/check-point';
import { RacePoint } from '../models/race-point';
import { CookieService } from 'ngx-cookie-service';
import { apiKey } from '../../environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RacePointService {

  // private racepointUrl = 'https://oxbridgecloud.azurewebsites.net/racepoints/';

  private userRacepointUrl = 'http://localhost:3000/v1/racepoints/';
  private adminRracepointUrl = 'http://localhost:3000/v1/admin/racepoints/';
  
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  /**
   * Sends a http get request to the backend, in order to get all racepoints
   * @param eventId - The id of the event
   */
  public getAllEventRacePoints(_id: string): Observable<RacePoint[]> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<RacePoint[]>(this.userRacepointUrl + "fromEvent/" + _id, httpOptions)
      .pipe(map(racePoints => { return racePoints['data'] }));
  }

  /**
   * Sends a http get request to the backend, in order to get start and finish points
   * @param eventId - The id of the event
   */
  public getStartAndFinish(_id: string): Observable<RacePoint[]>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<RacePoint[]>(this.userRacepointUrl+"startAndFinish/fromEvent/"+_id, httpOptions).pipe(map(racePoints => { return racePoints['data'] }))
  }

  /**
   * Sends a http post request to the backend, in order to save a new route
   * @param racepoints - The racepoints of the route
   * @param eventId - The id of the event
   */
  public saveRoute(racepoints: RacePoint[], eventId:number): Observable<RacePoint[]> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }

    let ret: RacePoint[] = [];
    for(const racepoint of racepoints){
      this.http.post<RacePoint>(this.adminRracepointUrl+"fromEvent/"+eventId, racepoint, httpOptions).pipe(map(r => {ret.push(r['data'])}));
    }
    return of(ret);
  }
}
