import 'dart:html';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:prototypeproject/UIs/API/api.dart';


class ShowEvent extends StatelessWidget {
@override
Widget build(BuildContext context){
  final HttpService httpService = HttpService();
  
return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("EVENTS"),
      ),
      
      body: Container(
          padding: EdgeInsets.all(16.0),
          child: FutureBuilder(
            future: httpService.getEvents(),
            builder: (BuildContext contex, AsyncSnapshot snapshot) {
              if (snapshot.data == null) {
                return Container(
                  child: Center(
                    child: CircularProgressIndicator(),
                  ),
                );
              } else {
                return ListView.builder(
                  itemCount: snapshot.data.length,
                  itemBuilder: (contex, index) => ListTile(
                    title: Text(snapshot.data[index].eventId),
                    subtitle: Text(snapshot.data[index].eventStart),
                    contentPadding: EdgeInsets.only(bottom: 20.0),
                  ),
                );
              }
            },
          ),
        ),
    );}}