using System;

namespace HandheldSite.Server.Models
{
    public class TokensDTO
    {

        public required string AccessToken {get;set;}
        public required string RefreshToken {get;set;}

    }
}
