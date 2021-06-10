class Event {
  // final String name, email, username;
  final int eventId;
 String eventStart, eventEnd, city, eventCode, actualEventStart, isLive;

  //Event({required this.name, required this.email, required this.username});
    Event(
      { this.eventId,
       this.eventStart,
       this.eventEnd,
    this.city,
    this.eventCode,
    this.actualEventStart,
    this.isLive});

    factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      eventId: json['eventId'],
      eventStart: json['eventStart'],
      eventEnd: json['eventEnd'],
      city: json['city'],
      eventCode: json['eventCode'],
      actualEventStart: json['actualEventStart'],
      isLive: json['isLive'],
    );
  }
  /*factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      name: json['name'],
      email: json['email'], 
      username: json['username'],
    );
  }*/
  /* eventId: Number,
    name: String, 
    eventStart: Date,
    eventEnd: Date,
    city: String,
    eventCode: String,
    actualEventStart : Date,
    isLive : Boolean
      */
}

mixin required {
}