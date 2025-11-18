using System;

namespace HandheldSite.Server.Models
{
    public class User
    {

        int Id {get;set;}
        string Username {get;set;} = string.Empty;
        
        string Email {get;set;} = string.Empty;

        string Password {get;set;} = string.Empty;
    }
}
