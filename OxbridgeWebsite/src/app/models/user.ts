import Role from './roles'; 

export class User {
    public firstname:string;
    public lastname:string;
    public email:string;
    public phone:string;
    public username:string;
    public password:string;
    public confirmPassword:string;
    public acessToken:string;
    public roles:Role[];
    public admin?:Boolean;
    public _id?:string;
    constructor(){};

}
