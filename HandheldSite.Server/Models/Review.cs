using System;

namespace HandheldSite.Server.Models
{
    public class Review
    {

        public int Id {get;set;} 

        public int UserId {get;set;}

        public string PrimaryImage {get;set;} = string.Empty;

        public string SecondaryImage {get;set;} = string.Empty;

        public string ReviewText {get;set;} = string.Empty;

    }
}
