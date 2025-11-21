using HandheldSite.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HandheldSite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {

        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet("GetUserProfileinfo/{userid}")]
        public async Task<IActionResult> GetUserProfileinfo(string userid)
        {
            try
            {
                object profilePageInfo = await _profileService.GetUserProfileinfo(userid);
                return Ok(profilePageInfo);
                
            }
            catch (Exception)
            {
                return BadRequest("Unable to fetch Profile Data");
            }


        }
    }
}
