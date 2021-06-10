import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { EventRegistration } from '../models/event-registration';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Participant } from '../models/participant';
import { apiKey } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationService {

  //  private eventRegistrationUrl = 'https://oxbridgecloud.azurewebsites.net/eventRegistrations/';

  private userEventRegistrationUrl = 'http://localhost:3000/v1/eventRegistrations/';
  private adminEventRegistrationUrl = 'http://localhost:3000/v1/admin/eventRegistrations/';

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  /**
   * Sends a http post request to the backend, in order to sign up for an event
   * @param shipId 
   * @param teamName 
   * @param eventCode 
   */
  public SignUpForEvent(shipId:number, teamName:string, eventCode:string): Observable<EventRegistration> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.post<EventRegistration>(this.userEventRegistrationUrl + eventCode, {shipId, teamName}, httpOptions).pipe(map(eventReg => { return eventReg['data']}));
  }

  /**
   * Sends a http get request to the backend in order to get all participants of an event and returns the respons
   * @param eventId 
   */
  public getParticipants(_id:string): Observable<Participant[]>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.get<Participant[]>(this.userEventRegistrationUrl+"participants/fromEvent/"+_id, httpOptions).pipe(map(participants => { return participants['data'] }))
  }

  /**
   * Sends a http post request to the backend, in order to add a participant to an event
   * @param participant 
   */
  /*public addParticipant(participant): Observable<Participant>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.post<Participant>(this.userEventRegistrationUrl+"addParticipant", participant, httpOptions).pipe(map(participant => {return participant}));
  }*/

  /**
   * Sends a http put request to the backend, in order to update a participants information
   * @param participant 
   */
  /*public updateParticipant(participant): Observable<Participant>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.put<Participant>(this.userEventRegistrationUrl+"updateParticipant/"+participant.eventRegId, participant, httpOptions).pipe(map(participant => {return participant}));
  }*/

 /**
   * Sends a http put request to the backend, in order to update event registration info
   * @param participant 
   */
  public updateEventRegistration(eventRegistration: EventRegistration): Observable<EventRegistration>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.put<EventRegistration>(this.adminEventRegistrationUrl+"updateParticipant/"+ eventRegistration._id, httpOptions).pipe(map(participant => {return participant['data']}));
  }

  /**
   * Sends a http delete request to the backend, in order to delete an participant for an event
   * @param eventRegId 
   */
  public deleteParticipant(_id: string): Observable<EventRegistration>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }
    return this.http.delete<EventRegistration>(this.adminEventRegistrationUrl+_id, httpOptions).pipe(map(eventRegistration => {return eventRegistration['data']}));
  }

  public unSubscribeToEvent(_id): Observable<EventRegistration>
  {
    return this.deleteParticipant(_id);
  }
}
