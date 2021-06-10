import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Ship } from '../models/ship';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiKey } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipService {

  // private shipUrl = 'https://oxbridgecloud.azurewebsites.net/ships/'

  private shipUrl = 'http://localhost:3000/v1/ships/'
  constructor(private http: HttpClient, private cookieService:CookieService) { }

  /**
   * Sends a http get request to the backend, in order to get all users ships
   */
  public getMyShips(): Observable<Ship[]> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<Ship[]>(this.shipUrl+"mine", httpOptions)
      .pipe(map(ships => { 
        return ships['data']
       }));
  }

  /**
   * Sends a http delete request to the backend, in order to delete a ship
   * @param shipId - The id of the ship
   */
  public deleteShip(_id: string): Observable<Ship>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.delete<Ship>(this.shipUrl+_id, httpOptions)
      .pipe(map(ship => { return ship['data'] }));
  }

  /**
   * Sends a http post request to the backend, in order to add a ship
   * @param newShip - The new ship to be added
   */
  public addShip(newShip: Ship): Observable<Ship>
  {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    newShip.userId = user._id;
    return this.http.post<Ship>(this.shipUrl, newShip, httpOptions).pipe(map(ship => { return ship['data'] }));
  }
}
