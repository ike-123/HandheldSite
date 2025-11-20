using System.Diagnostics;
using HandheldSite.Server.Models;
using HandheldSite.Server.Services;
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

        public AuthController(IAuthService authService, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _authservice = authService;
            _configuration = configuration;
            _logger = logger;
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
            Debug.WriteLine("hey");

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
    }
}
