import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import * as decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { apiKey } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private userUrl = 'https://oxbridgecloud.azurewebsites.net/users/'

  private userUrl = 'http://localhost:3000/v1/users/';
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  /**
   * Sends a http post request to the backend, in order to register as a new user
   * @param newUser - The new user to be registered
   */
  public registerUser(newUser: User): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      })
    }
    return this.http.post<User>("http://localhost:3000/v1/signup/", newUser, httpOptions).pipe(map(user => {
      return user['data'];
    }));
  }

  /**
   * Sends a http post request to the backend, in order to login
   * @param email - The email of the user
   * @param password - The password of the user
   */
  public login(email:string, password:string): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      })
    }
    return this.http.post<User>("http://localhost:3000/v1/login/", {email, password}, httpOptions).pipe(map(user => {
      return user['data'];
    }));

  }

  /**
   * Decodes the given token
   * @param token - The token that should be decoded
   */
  getDecodedAccessToken(token: string): any {
    try {
      return decode(token);
    }
    catch (error) {
      return null;
    }
  }

  /**
   * Sends a http put request to the backend, in order to update a user
   * @param newUser - The updated user
   */
  public updateUser(newUser): Observable<User>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + user.accessToken
      })
    }

    let object = {
      "firstname": newUser.firstname,
      "lastname": newUser.lastname,
      "password": newUser.confirmPassword
    }
    return this.http.put<User>(this.userUrl, object, httpOptions).pipe(map(user => { return user }));
  }
}
