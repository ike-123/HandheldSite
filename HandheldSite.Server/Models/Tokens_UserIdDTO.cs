using System;

namespace HandheldSite.Server.Models
{
    public class Tokens_UserIdDTO
    {

        public required string AccessToken {get;set;}
        public required string RefreshToken {get;set;}
        public required string Userid {get;set;}

    }
}
