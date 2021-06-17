using System;

namespace TheOxbridgeApp.Models
{
    public static class Target
    {
        private const String warmal = "https://oxbridgecloud.azurewebsites.net/";
        private const String db1 = "https://192.168.1.248:5000/";
        private const String db2 = "http://10.0.2.2:3000";
        private const String StandardAdress = db2;

        public const String Authenticate = StandardAdress + "/v1/login";
        public const String Events = StandardAdress + "/v1/events/";
        public const String EventsFromUsername = StandardAdress + "/v1/events/mine";
        public const String EventRegistrations = StandardAdress + "/v1/mine/fromEvent/";
        public const String Locations = StandardAdress + "/v1/locationRegistrations/";
        public const String StartAndFinishPoints = StandardAdress + "/v1/racepoints/startAndFinish/";
        public const String LiveLocations = StandardAdress + "/v1/locationRegistrations/fromEvent/";
        public const String ReplayLocations = StandardAdress + "/v1/locationRegistrations/fromEvent/";
        public const String Ships = StandardAdress + "/v1/ships/";
        public const String ShipFromEventId = StandardAdress + "/v1/ships/fromEvent/";
        //added route for password reset post method from the backend
        public const String ResetPassword = StandardAdress + "/v1/reset";
    }
}
