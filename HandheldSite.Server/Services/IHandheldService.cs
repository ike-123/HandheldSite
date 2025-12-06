using System;
using HandheldSite.Server.Models;

namespace HandheldSite.Server.Services
{
    public interface IHandheldService
    {

        Task<List<Handheld>> GetAllHandhelds();

        Task CreateHandheld(CreateHandheldDTO _submittedHandheld);
    }
}
