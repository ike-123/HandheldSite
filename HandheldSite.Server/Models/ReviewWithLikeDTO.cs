using System;

namespace HandheldSite.Server.Models
{
    public class ReviewWithLikeDto
    {

        public int ReviewId {get;set;} 

        public Guid UserId {get;set;}

        public int HandheldId {get;set;}

        public byte[]? PrimaryImage {get;set;} 

        public string ReviewText {get;set;} = string.Empty;

        public DateTime CreatedAt {get;set;} 

        public required bool isLiked {get;set;}

        public int LikeCount {get;set;}

        public required object user {get;set;}

    }
}
