using System;

namespace TheOxbridgeApp.Models
{
    public class User : ISerializable
    {
        public String email { get; set; }
        public String firstname { get; set; }
        public String lastname { get; set; }
        public String password { get; set; }
        public String accessToken { get; set; }
    }
}
