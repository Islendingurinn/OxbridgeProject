import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart';
import 'package:prototypeproject/Model/event.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;




class HttpService {
  final String eventsURL = 'http://localhost:3000/v1/events';
  static String token = "";


  //register new user
  Future<dynamic> postRequest (firstName,lastName,email,password) async {
  var url ='http://localhost:3000/v1/signup';
  var body = jsonEncode({'firstname':firstName, 'lastname':lastName, 'email':email,'password':password });
  

  print("Body: " + body);

  await post(Uri.parse(url),
      headers: {
        "Content-Type": "application/json",
        "x-api-key":"wretwreytgwrsg3534632342"
        },
      body: body
  ).then((Response response) {
    print("Response status: ${response.statusCode}");
    print("Response body: ${response.contentLength}");
    print(response.headers);
    print(response.request);
    token="${json.decode(response.body)['data']['tokens']['accessToken']}";
     print (json.decode(response.body)['data']['tokens']['accessToken']);
   


  });
   SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setString('accessToken', token);
  String tokens = prefs.getString('token');
  print(tokens);

 }
 //get events
  
Future<List<Event>> getEvents() async {

    Response res = await http.get(Uri.parse(eventsURL), 
    headers: {
        "Content-Type": "application/json",
        "Accept" :"application/json",
        "x-api-key":"wretwreytgwrsg3534632342", 
        "Authorization":"Bearer " + token
        
        },
    );
    print ('Token :{token}');
    print(res);
    print (json.decode(res.body)['data']);
  


    if (res.statusCode == 200) {
      List<dynamic> body = jsonDecode(res.body)['data'];

      List<Event> events = body
        .map(
          (dynamic item) => Event.fromJson(item),
        )
        .toList();

      return events;
    } else {
      throw "Unable to retrieve events.";
    }
  }
}