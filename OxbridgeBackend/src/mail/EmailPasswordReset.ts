import User from "../database/model/User";
import { transporter } from './';

/**
  * The class handles sending out the reset password
  * to users who have asked for a new password.
  */

export default class EmailPasswordReset{

    user: User;
    password: String;

    constructor(user: User, password: String){
        this.user = user;
        this.password = password;

        try{
            this.task();
        }catch(e){
            console.error(' error: ' + e);
        }
    }

    async task(): Promise<void> {
        await transporter.sendMail({
            from: '"Tregatta" <tregattasonderborg@gmail.com>',
            to: this.user.email,
            subject: "Anmodning om en ny adgangskode",
            text: "Din konto har anmodet om en ny midlertidig adgangskode. Din nye adgangskode er " + this.password,
            html: "<strong>Din konto har anmodet om en ny midlertidig adgangskode. Din nye adgangskode er " + this.password + "</strong>",
            headers: { 'x-myheader': 'Tregatta Event' }
          });
    }
}