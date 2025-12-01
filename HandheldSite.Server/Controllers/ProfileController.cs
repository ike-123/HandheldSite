using System.Security.Claims;
using HandheldSite.Server.Models;
using HandheldSite.Server.Services;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("GetMyProfile")]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var userid_string = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;


                object profilePageInfo = await _profileService.GetUserProfileinfo(userid_string);
                return Ok(profilePageInfo);
                
            }
            catch (Exception)
            {
                return Unauthorized("User not found");
            }


        }

        [Authorize]
        [HttpPost("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDTO updatedProfileDTO)
        {
            
            if (updatedProfileDTO == null)
            {
                return BadRequest("Invalid Profile data.");
            }

            try
            {
                var userid_string = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                object profilePageInfo = await _profileService.ChangeUserProfile(updatedProfileDTO,userid_string!);

                return Ok(profilePageInfo);
                
            }
            catch (Exception)
            {
                return Unauthorized("User not found");
            }


        }

        //Create GetMyProfile route
    }
}
