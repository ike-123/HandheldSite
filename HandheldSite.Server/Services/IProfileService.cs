using System;

namespace HandheldSite.Server.Services
{
    public interface IProfileService
    {
        Task<object> GetUserProfileinfo(string userid);
    }
}
