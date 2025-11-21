using System;
using Microsoft.AspNetCore.Identity;

namespace HandheldSite.Server.Models
{
    public class User: IdentityUser<Guid>
    {

        public string? RefreshToken {get;set;}
        public DateTime? RefreshTokenExpiresAtUTC{get; set;}


        public static User Create(string email, string username)
        {
            return new User
            {
                Email = email,
                UserName = username
            };
        }
    }
}
