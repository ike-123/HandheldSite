using System;

namespace HandheldSite.Server.Services
{
    public interface IProfileService
    {

        Task<object> GetUser(string userid);
        Task<object> GetUserProfileinfo(string userid);
    }
}
