using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using TheOxbridgeApp.Data;
using TheOxbridgeApp.Models;

namespace TheOxbridgeApp.Services
{
    public class ServerClient
    {
        #region -- Local variables -- 
        private DataController dataController;
        #endregion

        public ServerClient()
        {
            dataController = new DataController();
        }


        /// <summary>
        /// Contacts the backend in order to login and get a token from the backend 
        /// </summary>
        /// <param name="username">The username of the user</param>
        /// <param name="password">The password of the user</param>
        /// <returns>A user with a token</returns>
        public void Login(String username, String password)
        {
            User foundUser = new User();
            try
            {
                Console.WriteLine("------starting login procedure-------");
                String target = Target.Authenticate;
                Console.WriteLine("------building json-------");
                String jsonData = "{\"email\": \"" + username + "\", \"password\": \"" + password + "\" }";
                Console.WriteLine(jsonData);
                WebRequest request = WebRequest.Create(target);
                request.Method = "POST";
                request.ContentType = "application/json";
                String header = "x-api-key:api key";
                request.Headers.Add(header);

                Console.WriteLine("------firing-------");
                using (Stream requestStream = request.GetRequestStream())
                {
                    Console.WriteLine("------using getStreamRequest-------");
                    using (StreamWriter streamWriter = new StreamWriter(requestStream))
                    {
                        Console.WriteLine("------using streamWriter-------");
                        streamWriter.Write(jsonData);
                    }
                }
                Console.WriteLine("------getting response-------");
                String responseFromServer = GetResponse(request);
                Console.WriteLine(responseFromServer);
                Console.WriteLine("------deserializing user-------");

                //string distance = jObject.SelectToken("routes[0].legs[0].distance.text").ToString();
                //JObject jo = JObject.Parse(json);
                //string userJson = jo.SelectToken("data[0]").ToString();

                var result = JArray.Parse(responseFromServer);   //parses entire stream into JObject, from which you can use to query the bits you need.
                Console.WriteLine(result);
                Console.WriteLine(result["data"]["user"]);


                foundUser = JsonConvert.DeserializeObject<User>(responseFromServer);
                foundUser.email = username;
            } catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            //return foundUser;
        }

        //implemented resetpassword method right here
        public String ResetPassword(String email)
        {
            String target = Target.ResetPassword;

            String jsonData= "{\"email\": \"" + email + "\"}";
            WebRequest request = WebRequest.Create(target);
            request.Method = "POST";
            request.ContentType = "application/json";
            String response="";
            String header = "x-api-key:api key";
            request.Headers.Add(header);
            try
            {
                using (Stream requestStream = request.GetRequestStream())
                {
                    using (StreamWriter streamWriter = new StreamWriter(requestStream))
                    {
                        streamWriter.Write(jsonData);
                    }
                }

                 response = GetResponse(request);
            }
            catch (Exception)
            {
                Console.Write("reset password error webexception");
            }
            return response;
        }

        /// <summary>
        /// Gets the last 20 locations for each boat in a specific event from the backend 
        /// </summary>
        /// <param name="eventId">The eventId for the event in question</param>
        /// <returns>Returns a List of ShipLocations</returns>
        public List<ShipLocation> GetLiveLocations(int eventId)
        {
            try { 
            WebRequest request = WebRequest.Create(Target.LiveLocations + eventId);
            request.Method = "GET";
            request.ContentType = "application/json";
                String header = "x-api-key:api key";
                request.Headers.Add(header);

                String responseFromServer = GetResponse(request);
            List<ShipLocation> locations = JsonConvert.DeserializeObject<List<ShipLocation>>(responseFromServer);
            
                return locations;
            }
            catch (Exception)
            {
                Console.Write("GetLiveLocations error webexception");
            }
            return new List<ShipLocation>();
        }

        /// <summary>
        /// Gets all the events that the logged in user is signed up for from the backend 
        /// </summary>
        /// <returns>A task with a List of TrackingEvents</returns>
        public async Task<List<TrackingEvent>> GetTrackingEvents()
        {
            try {
            WebRequest request = WebRequest.Create(Target.EventsFromUsername);
            request.Method = "GET";
            request.ContentType = "application/json";
            request.Headers.Add("x-access-token", (await dataController.GetUser()).accessToken);
                String header = "x-api-key:api key";
                request.Headers.Add(header);

                String responseFromServer = GetResponse(request);
            List<TrackingEvent> events = JsonConvert.DeserializeObject<List<TrackingEvent>>(responseFromServer);

            return events;
            }
            catch (Exception)
            {
                Console.Write("GetTrackingEvents error webexception");
            }
            return new List<TrackingEvent>();
        }


        /// <summary>
        /// Gets all events from the backend
        /// </summary>
        /// <returns>A list of Events</returns>
        public List<Event> GetEvents()
        {
            try { 
            WebRequest request = WebRequest.Create(Target.Events);
            request.Method = "GET";
                String header = "x-api-key:api key";
                request.Headers.Add(header);

                String responseFromServer = GetResponse(request);

            List<Event> events = JsonConvert.DeserializeObject<List<Event>>(responseFromServer);
            return events;
            }
            catch (Exception)
            {
                Console.Write("GetEvents error webexception");
            }
            return new List<Event>();
        }


        /// <summary>
        /// Gets all locations from all boats in a specific event from the backend
        /// </summary>
        /// <param name="eventId">The eventId for the event in question</param>
        /// <returns>A list of ShipLocations</returns>
        public List<ShipLocation> GetReplayLocations(int eventId)
        {
            try
            {
                WebRequest request = WebRequest.Create(Target.ReplayLocations + eventId);
                request.Method = "GET";
                request.ContentType = "application/json";

                String responseFromServer = GetResponse(request);
                List<ShipLocation> locations = JsonConvert.DeserializeObject<List<ShipLocation>>(responseFromServer);

                return locations;
            }
            catch (Exception)
            {
            }
            return new List<ShipLocation>();
        }

        /// <summary>
        /// Gets a specific Ship from the backend 
        /// </summary>
        /// <param name="ShipId">The ShipId for the ship in question</param>
        /// <returns>A Ship</returns>
        public Ship GetShip(int ShipId)
        {
            try { 
            WebRequest request = WebRequest.Create(Target.Ships + ShipId);
            request.Method = "GET";
            request.ContentType = "application/json";

            String responseFromServer = GetResponse(request);
            Ship ship = JsonConvert.DeserializeObject<Ship>(responseFromServer);
            return ship;
            }
            catch (Exception)
            {
                Console.Write("GetShip error webexception");
            }
            return new Ship();
        }

        /// <summary>
        /// Gets the start and the fininish locations from the backend
        /// </summary>
        /// <param name="eventId">The eventId of the event in question</param>
        /// <returns>A List of RacePoints</returns>
        public List<RacePoint> GetStartAndFinish(int eventId)
        {
            try { 
            WebRequest request = WebRequest.Create(Target.StartAndFinishPoints + eventId);
            request.Method = "GET";
            request.ContentType = "application/json";

            String responseFromServer = GetResponse(request);
            List<RacePoint> racePoints = JsonConvert.DeserializeObject<List<RacePoint>>(responseFromServer);
            return racePoints;
            }
            catch (Exception)
            {
                Console.Write("GetStartAndFinish error webexception");
            }
            return new List<RacePoint>();
        }


        /// <summary>
        /// Get all Ships from a specific event from the backend
        /// </summary>
        /// <param name="eventId">The eventId of the event in question</param>
        /// <returns>A List of Ships</returns>
        public List<Ship> GetShipsFromEventId(int eventId)
        {
            WebRequest request = WebRequest.Create(Target.ShipFromEventId + eventId);
            request.Method = "GET";
            request.ContentType = "application/json";
            List<Ship> ships = null;
            try { 
            String responseFromServer = GetResponse(request);            
            if (!responseFromServer.Equals("{}"))
            {
                ships = JsonConvert.DeserializeObject<List<Ship>>(responseFromServer);
                return ships;
            }
            }
            catch (Exception)
            {
                Console.Write("GetShipsFromEventId error webexception");
            }
            return new List<Ship>();
        }

        /// <summary>
        /// Gets the response from a request from the backend
        /// </summary>
        /// <param name="request">The request from which you want a response</param>
        /// <returns>A string with the response</returns>
        private String GetResponse(WebRequest request)
        {
            String responseFromServer = "";
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                Console.WriteLine(response);
                using (Stream responseStream = response.GetResponseStream())
                {
                    Console.WriteLine("reached responseStream");
                    using (StreamReader reader = new StreamReader(responseStream))

                        responseFromServer = reader.ReadToEnd();
                    Console.WriteLine(responseFromServer);
                }

                return responseFromServer;
            }
        }

        /// <summary>
        /// Posts object with the ISerializable interface to a specific target url to the backend
        /// </summary>
        /// <param name="serializable">The ISerializable object that needs to be posted</param>
        /// <param name="target">The target url</param>
        /// <returns>A task with a boolean, true if succes and false if not</returns>
        public async Task<bool> PostData(ISerializable serializable, String target)
        {
            String statusCode = "";
            String jsonData = JsonConvert.SerializeObject(serializable);
            WebRequest request = WebRequest.Create(target);
            request.Method = "POST";
            request.ContentType = "application/json";
            //request.Headers.Add("x-access-token", (await dataController.GetUser()).accessToken);

            try { 
            using (Stream requestStream = request.GetRequestStream())
            {
                using (StreamWriter streamWriter = new StreamWriter(requestStream))
                {
                    streamWriter.Write(jsonData);
                }
            }
            try
            {
                statusCode = GetStatusCode(request);
            }
            catch (Exception)
            {
            }
            if (statusCode.ToLower().Equals("created"))
            {
                return true;
            }
            else
            {
                return false;
            }
            }
            catch (Exception)
            {
                Console.Write("PostData error webexception");
            }
            return false;
        }


        /// <summary>
        /// Gets the statuscode for a request from the backend
        /// </summary>
        /// <param name="request">The request from which a status code is needed</param>
        /// <returns>A string of the statuscode</returns>
        private String GetStatusCode(WebRequest request)
        {
            String returnValue = "";
            try { 
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                returnValue = response.StatusCode.ToString();
            }
            }
            catch (Exception)
            {
                Console.WriteLine("GetStatusCode error webexception");
            }
            return returnValue;
        }
    }
}