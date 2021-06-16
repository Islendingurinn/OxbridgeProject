class Event {
 
 String eventId, eventStart, eventEnd, city, eventCode, actualEventStart, isLive, name;

  
    Event({
        this.name,
        this.eventId,
        this.eventStart,
        this.eventEnd,
        this.city,
        this.eventCode,
        this.actualEventStart,
        this.isLive
      });

    factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      name:json['name'],
      eventId: json['_id'],
      eventStart: json['eventStart'],
      eventEnd: json['eventEnd'],
      city: json['city'],
      eventCode: json['eventCode'],
      actualEventStart: json['actualEventStart'],
      isLive: json['isLive'],
    );
  }
 
}

mixin required {
}