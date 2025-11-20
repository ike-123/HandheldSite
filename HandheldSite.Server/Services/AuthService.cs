using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using HandheldSite.Server.Data;
using HandheldSite.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace HandheldSite.Server.Services
{
    public class AuthService: IAuthService
    {

        private readonly MyDbContext _dbcontext;
        private readonly IConfiguration _configuration;
    


        public AuthService(MyDbContext dbContext, IConfiguration configuration)
        {
            _dbcontext = dbContext;
            _configuration = configuration;
        }

        public async Task<User?> RegisterAsync(RegisterRequest registerRequest)
        {

            if(await _dbcontext.Users.AnyAsync(user => user.Email == registerRequest.Email))
            {
                //user already exists
                return null;
            }

            else
            {
                var user = User.Create(registerRequest.Email,registerRequest.Email);

                var hashedPassword = new PasswordHasher<User>().HashPassword(user, registerRequest.Password);
                user.PasswordHash = hashedPassword;
                
                await _dbcontext.Users.AddAsync(user);
                await _dbcontext.SaveChangesAsync();

                return user;
                

            }

        }


        public async Task<TokensDTO?> LoginAsync(LoginRequest loginRequest)
        {

            User? user = await _dbcontext.Users.FirstOrDefaultAsync(user=> user.Email == loginRequest.Email);

            if(user == null)
            {
                return null;
            }

            if(new PasswordHasher<User>().VerifyHashedPassword(user,user.PasswordHash,loginRequest.Password) == PasswordVerificationResult.Failed)
            {
                return null;
            }

            return new TokensDTO{AccessToken = CreateJWTToken(user), RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)};

        }

        
        public async Task<TokensDTO?> RefreshTokensAsync(string? refreshToken)
        {

            if (string.IsNullOrEmpty(refreshToken))
            {
                return null;
            }

            var user = await _dbcontext.Users.FirstOrDefaultAsync(user=> user.RefreshToken == refreshToken);

            if(user == null || user.RefreshTokenExpiresAtUTC < DateTime.UtcNow)
            {
                return null;
            }

            //generate new refresh-Token and access-Token
            return new TokensDTO{AccessToken = CreateJWTToken(user), RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)};

        }

       
        private string CreateJWTToken(User user)
        {
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JwtOptions:Secret")!));

            var credentinals = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Email.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration.GetValue<string>("JwtOptions:Issuer"),
                audience: _configuration.GetValue<string>("JwtOptions:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JwtOptions:ExpirationTimeInMinutes")),
                signingCredentials: credentinals

            );

            var JWTToken = new JwtSecurityTokenHandler().WriteToken(token);

            return JWTToken;
        }



        public string GenerateRefreshToken()
        {
            var RandomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(RandomNumber);
            
            return Convert.ToBase64String(RandomNumber);
        }

        public async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var RefreshToken = GenerateRefreshToken();

            user.RefreshToken = RefreshToken;
            user.RefreshTokenExpiresAtUTC = DateTime.UtcNow.AddDays(7);

            await _dbcontext.SaveChangesAsync();

            return RefreshToken;

        }
    }
}
