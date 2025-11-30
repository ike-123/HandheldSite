using System;
using HandheldSite.Server.Models;

namespace HandheldSite.Server.Services
{
    public interface IProfileService
    {

        Task<object> GetUser(string userid);
        Task<object> GetUserProfileinfo(string userid);

        Task ChangeUserProfile(UpdateProfileDTO UpdatedProfileDTO, string userid);
    }
}
