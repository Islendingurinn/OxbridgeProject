import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Event } from 'src/app/models/event';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { MyEvents } from '../models/my-events';
import { EventRegistration } from '../models/event-registration';
import { apiKey } from '../../environments/environment';
import { Participant } from '../models/participant';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  // private eventsUrl = 'https://oxbridgecloud.azurewebsites.net/events/';

  private userEventsUrl = 'http://localhost:3000/v1/events/';
  private adminEventsUrl = 'http://localhost:3000/v1/admin/events/';
  
  constructor(private http: HttpClient, private cookieService:CookieService) { }

  /**
   * Sends a http get event to the backend, in order to retrieve all events
   */
  public getEvents(): Observable<Event[]> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<Event[]>(this.userEventsUrl, httpOptions)
      .pipe(
        map(events => { return events['data'] }),
        catchError(this.handleError<Event[]>('getEvents', []))
      );
  }

  /**
   * Sends a http get request to the backend, in order to retrieve an specific event
   * @param eventId - The id of the event
   */
  public getEvent(_id:string): Observable<Event> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<Event>(this.userEventsUrl+_id, httpOptions)
      .pipe(map(event => { return event['data']}));
  }

  /**
   * Sends a http get request to the backend, in order to retrieve all events, that the user is a participant of
   */
  public getMyEvents(): Observable<MyEvents[]> {
    let user = JSON.parse(this.cookieService.get('user'));
    //console.log("user token: "+user.token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<MyEvents[]>(this.userEventsUrl+"mine", httpOptions)
      .pipe(map(events => { return events['data'] }));
  }

  /**
   * Sends a http post request to the backend, in order to create a new event
   * @param event - the new event
   */
  public AddEvent(event: Event): Observable<Event> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    
    let newEvent = {
      "name": event.name,
      "eventStart": event.eventStart+"T"+event.eventStartTime+":00.000+00:00",
      "eventEnd": event.eventEnd+"T"+event.eventEndTime+":00.000+00:00",
      "eventCode": event.eventCode,
      "city": event.city
    }

    return this.http.post<Event>(this.adminEventsUrl, newEvent, httpOptions).pipe(map(event => { return event['data'] }));
  }

  /**
   * Sends a http put request to the backend, in order to update an event  
   * @param event - The new event information
   * @param eventId - The id of the event
   */
  public updateEvent(event: Event): Observable<Event>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.put(this.adminEventsUrl+event._id, event, httpOptions).pipe(map(event => {return event['data']}));
  }

  /**
   * Sends a http delete request to the backend, in order to delete an event
   * @param eventId - The id of the event
   */
  public deleteEvent(_id: string): Observable<Event>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.delete(this.userEventsUrl+_id, httpOptions).pipe(map(event => {return event['data']}));
  }

  /**
   * Sends a http get request to the backend, in order to check if the event has a route
   * @param eventId - The id of the event
   */
  public hasRoute(_id: string): Observable<boolean>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<boolean>(this.userEventsUrl+"hasRoute/"+_id, httpOptions).pipe(map(res => { return res['data'] }))
  }

  /**
   * Sends a http put request to the backend, in order to start an event
   * @param eventId - The id of the event
   */
  public startEvent(_id: string): Observable<Event>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.put<Event>(this.userEventsUrl+"start/"+_id, httpOptions).pipe(map(event => { return event['data'] }));
  }

  /**
   * Sends a http get request to the backend, in order to stop an event
   * @param eventId - The id of the event
   */
  public stopEvent(_id: string): Observable<Event>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<Event>(this.userEventsUrl+"stop/"+_id, httpOptions).pipe(map(event => {return event['data']}));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return null;
    };
  }

}
