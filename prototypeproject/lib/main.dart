
import 'package:flutter/material.dart';


import 'UIs/Home.dart';
//import 'form.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Home Page',
      theme: ThemeData(
        primarySwatch: Colors.teal,
      ),
      home: Home(),
          );
        }
      }
      
      