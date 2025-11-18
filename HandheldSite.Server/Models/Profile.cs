using System;

namespace HandheldSite.Server.Models
{
    public class Profile
    {
        int user_ID {get;set;}
        string age {get;set;} = string.Empty;
        string gender {get;set;} = string.Empty;
        string country {get;set;} = string.Empty;
        string description {get;set;} = string.Empty;
        string profilelink {get;set;} = string.Empty;
    }
}
