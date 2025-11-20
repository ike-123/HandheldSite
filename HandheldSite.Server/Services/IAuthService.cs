using System;
using HandheldSite.Server.Models;
using Microsoft.AspNetCore.Identity.Data;

namespace HandheldSite.Server.Services
{
    public interface IAuthService
    {

        Task<User?> RegisterAsync(RegisterRequest registerRequest);

        Task<TokensDTO?> LoginAsync(LoginRequest loginRequest);

        Task<TokensDTO?> RefreshTokensAsync(string? refreshRequest);


    }
}
