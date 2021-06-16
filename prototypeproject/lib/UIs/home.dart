import 'package:flutter/material.dart';
import 'add_user.dart';
import 'eventPage.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text('THE OXBRIDGE RACE'),
      ),
    
     floatingActionButton: Wrap( 
                
                  children: <Widget>[
                        Container( 
                          alignment: Alignment.center,
                          margin:EdgeInsets.all(8),
                          child:Column (
                             mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                          FloatingActionButton.extended(  
                          onPressed: () {
                            Navigator.push(
                            context, MaterialPageRoute(builder: (context) => ShowEvent()));
                          },  
                          icon: Icon(Icons.event),  
                          label: Text("View events"), 
                          )
                       ]), ),

                        Container( 
                          alignment: Alignment.center,
                          margin:EdgeInsets.all(8),
                          child: Column (
                             mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[FloatingActionButton.  extended(  
                             
                          onPressed: () {
                            Navigator.push(
                            context, MaterialPageRoute(builder: (context) => AddUser()));
                          },  
                          icon: Icon(Icons.add),  
                          label: Text("Add a new user"), 
                            
                          )
                              ])
                           
                        ),

                ],
            ),
    );
  }
}