using System.Diagnostics;
using System.Security.Claims;
using HandheldSite.Server.Models;
using HandheldSite.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace HandheldSite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authservice;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;
        private readonly IProfileService _profileService;

        public AuthController(IAuthService authService, IConfiguration configuration, ILogger<AuthController> logger, IProfileService profileService)
        {
            _authservice = authService;
            _configuration = configuration;
            _logger = logger;
            _profileService = profileService;
        }
        
        [HttpPost("Register")]
        public async Task<ActionResult> Register(RegisterRequest registerRequest)
        {
            var result = await _authservice.RegisterAsync(registerRequest);

            if(result == null)
            {
                return BadRequest("Username already exists");
            }

            return Ok();

        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login(LoginRequest loginRequest)
        {

            var result = await _authservice.LoginAsync(loginRequest);

            if(result == null)
            {
                return BadRequest("Username or Password is Incorrect");
            }

            //Send AccessToken as a HTTPonly Cookie
            Response.Cookies.Append("Access_Token", result.AccessToken , new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                IsEssential = true,
                Expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JwtOptions:ExpirationTimeInMinutes"))
            });
            
            //Send Refreshtoken as a HTTPonly Cookie
            Response.Cookies.Append("Refresh_Token", result.RefreshToken , new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                IsEssential = true,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(); 

        }

        [HttpGet("RefreshToken")]
        public async Task<ActionResult> RefreshToken()
        {

            _logger.LogInformation("RefreshToken endpoint called");

            var refreshToken = Request.Cookies["Refresh_Token"];

            var result = await _authservice.RefreshTokensAsync(refreshToken);

            if(result is null)
            {
                return Unauthorized("Invalid Refresh-Token");
            }

            //Send AccessToken as a HTTPonly Cookie
            Response.Cookies.Append("Access_Token", result.AccessToken , new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                IsEssential = true,
                Expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JwtOptions:ExpirationTimeInMinutes"))
            });
            
            //Send RefreshToken as a HTTPonly Cookie
            Response.Cookies.Append("Refresh_Token", result.RefreshToken , new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                IsEssential = true,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(); 

        }

        [Authorize]
		[HttpGet("Ping")]
		public async Task<IActionResult> AuthenticatedUserEndpoint()
		{
            var userid_string = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            try
            {
                object profilePageInfo = await _profileService.GetUserProfileinfo(userid_string!);
                return Ok(profilePageInfo);
                
            }
            catch (Exception)
            {
                return Unauthorized("User not found");
            }

		}

        [Authorize]
        [HttpGet("Logout")]
		public async Task<IActionResult> Logout()
		{
			//get the name of the user through jwt claims
			var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

			if (userid == null)
			{
				return Unauthorized("user not found");
			}


			await _authservice.LogoutAsync(userid);

            //Delete AccessToken as a HTTPonly Cookie
            Response.Cookies.Delete("Access_Token" , new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                IsEssential = true,
                Expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JwtOptions:ExpirationTimeInMinutes"))
            });
            
            //Delete RefreshToken as a HTTPonly Cookie
            Response.Cookies.Delete("Refresh_Token" , new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                IsEssential = true,
                Expires = DateTime.UtcNow.AddDays(7)
            });


			return NoContent();


		}




    }
}
