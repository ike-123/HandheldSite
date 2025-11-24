using System;

namespace HandheldSite.Server.Models
{
    public class Review
    {

        public int ReviewId {get;set;} 

        public Guid UserId {get;set;}

        public int HandheldId {get;set;}

        public string PrimaryImage {get;set;} = string.Empty;

        public string SecondaryImage {get;set;} = string.Empty;

        public string ReviewText {get;set;} = string.Empty;

        public DateTime CreatedAt {get;set;} 

    }
}
