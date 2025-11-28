using System;

namespace HandheldSite.Server.Models
{
    public class CreateReviewDTO
    {

        public Guid UserId {get;set;}

        public string HandheldId {get;set;}

        public IFormFile? PrimaryImage {get;set;}

        public string SecondaryImage {get;set;} = string.Empty;

        public string ReviewText {get;set;} = string.Empty;
    }
}
