import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public model: User;
  public wrongEmail: boolean = false;

  constructor(private userService: UserService, private router: Router) {
    this.model = new User();
  }

  ngOnInit(): void {
  }

  /**
   * Event handler for clicking reset
   */
  OnSubmit() {
    this.userService.reset(this.model.email).pipe(first())
      .subscribe(user => {
        this.router.navigate(['/logind']);
      },
      //Showing error message to the user depending on the http respons
        error => {
          if(error.status === 400)
            this.model.email = "";
            this.wrongEmail = true;
        });
  }
}
