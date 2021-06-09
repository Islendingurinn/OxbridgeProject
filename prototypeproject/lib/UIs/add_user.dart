import 'package:flutter/material.dart';
import 'package:prototypeproject/UIs/API/api.dart';
import 'package:http/http.dart';



class AddUser extends StatefulWidget {
  @override
  _AddUserState createState() => _AddUserState();
}
class _AddUserState extends State<AddUser> {
  final HttpService api = HttpService();
 final TextEditingController firstNameController = TextEditingController();
 final TextEditingController lastNameController = TextEditingController();
 final TextEditingController emailController = TextEditingController();
 final TextEditingController passwordController = TextEditingController();

 final AlertDialog alert = AlertDialog(
   title: Text("Registration Error!"),
   content: Text("Please fill out all the fields"),
 );

  bool hidePassword = true;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
         centerTitle: true,
        title: Text('Register a New User'),
      ),
      body: Container(
        alignment: Alignment.center,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              // First name field
              Padding(padding: EdgeInsets.symmetric(horizontal:8,vertical:16),
              child: TextField(
                controller: firstNameController,
                decoration: InputDecoration(
                  prefixIcon: Icon(Icons.login),
                  border: OutlineInputBorder(),
                  hintText: "First Name",
                ),
              ),
              ),
              // Last name field
              Padding(padding: EdgeInsets.symmetric(horizontal:8,vertical:16),
              child: TextField(
                controller: lastNameController,
                decoration: InputDecoration(
                  prefixIcon: Icon(Icons.login),
                  border: OutlineInputBorder(),
                  hintText: "Last Name",
                ),
              ),
              ),
            // Email user name field
            Padding(padding: EdgeInsets.symmetric(horizontal:8,vertical:16),
              child: TextField(
                controller: emailController,
                decoration: InputDecoration(
                  prefixIcon: Icon(Icons.email),
                  border: OutlineInputBorder(),
                  hintText: "Email",
                ),
              ),),

            // Password field
            Padding(padding: EdgeInsets.symmetric(horizontal:8,vertical:16),
              child: TextField(
                controller: passwordController,
                decoration: InputDecoration(
                  prefixIcon: Icon(Icons.lock),
                  border: OutlineInputBorder(),
                  hintText: "Password",
                ),
                obscureText: hidePassword,
              ),
              ),
            
            ElevatedButton(
              child: Text('Register'),
              onPressed: () {
                if ( firstNameController.text !="" &&
                 lastNameController.text !="" &&
                  emailController.text !="" &&
                   passwordController.text !=""){
                     api.postRequest( emailController.text, passwordController.text);
                   }else{
                     showDialog(context: context, 
                     builder: (BuildContext context){return alert;});
                   }
                 } 
            )
          ]),
        ),
      );
  }
}