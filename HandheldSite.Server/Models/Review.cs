using System;

namespace HandheldSite.Server.Models
{
    public class Review
    {

        public int ReviewId {get;set;} 

        public Guid UserId {get;set;}

        public int HandheldId {get;set;}

        public byte[]? PrimaryImage {get;set;}

        public string SecondaryImage {get;set;} = string.Empty;

        public string ReviewText {get;set;} = string.Empty;

        public int LikeCount {get;set;} = 0;

        public DateTime CreatedAt {get;set;} 

    }
}
