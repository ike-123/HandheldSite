using System;

namespace HandheldSite.Server.Models
{
    public class UpdateProfileDTO
    {
        public string username {get;set;}
        public IFormFile? ProfileImage {get;set;}

    }
}
