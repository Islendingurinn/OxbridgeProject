import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { isAdmin } from '../../helpers/RoleHelper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public model: User;
  public wrongLogin: boolean = false;
  public wrongPassword: boolean = false;

  constructor(private userService: UserService, private cookieService: CookieService, private router: Router, private appComponent: AppComponent) {
    this.model = new User();
  }

  ngOnInit(): void {
  }

  /**
   * Event handler for clicking login
   */
  OnSubmit() {
    this.userService.login(this.model.email, this.model.password).pipe(first())
      .subscribe(user => {
        let userObject = Object.assign(new User(), user['user']);
        userObject.accessToken = user['tokens']['accessToken'];
        const admin = isAdmin(userObject.roles);
        user.admin = admin;
        this.cookieService.set('user', JSON.stringify(userObject), 1);

        if (admin) {
          this.router.navigate(['/administrerEvents']);
        }
        else {
          this.router.navigate(['/mineEvents']);
        }
        this.appComponent.updateUser();
      },
      //Showing error message to the user depending on the http respons
        error => {
          if (error.status === 401) {
            this.model.password = "";
            this.wrongLogin = false;
            this.wrongPassword = true;
          }
          else if(error.status === 400)
            this.model.email = "";
            this.model.password = "";
            this.wrongPassword = false;
            this.wrongLogin = true;
        });
  }
}
