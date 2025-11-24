using System.Diagnostics;
using System.Text;
using HandheldSite.Server.Data;
using HandheldSite.Server.Models;
using HandheldSite.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
	options.AddPolicy(name:"AllowReactApp",
		policy =>
		{
			policy.WithOrigins("http://localhost:5173") // React dev server
                  .AllowAnyHeader()
				  .AllowAnyMethod()
				  .AllowCredentials();

		});
});


var ConnectionString = builder.Configuration.GetConnectionString("DefaultConnectionString");

builder.Services.AddDbContext<MyDbContext>(options => options.UseMySql(ConnectionString, ServerVersion.AutoDetect(ConnectionString)));


builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<MyDbContext>();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddHttpClient();


builder.Services.AddScoped<IAuthService,AuthService>();
builder.Services.AddScoped<IReviewService,ReviewService>();
builder.Services.AddScoped<IProfileService,ProfileService>();
builder.Services.AddScoped<IHandheldService,HandheldService>();






builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer =   builder.Configuration["JwtOptions:Issuer"],
        ValidAudience = builder.Configuration["JwtOptions:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtOptions:Secret"]!)),
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            Debug.WriteLine("JWT received" + context.Request.Cookies["Access_Token"]);

            context.Token = context.Request.Cookies["Access_Token"];
            return Task.CompletedTask;
        },

          OnAuthenticationFailed = context =>
        {
            // Log exception to console during development so you can see why validation failed
            Debug.WriteLine("JWT Authentication Failed: " + context.Exception?.Message);
            Console.WriteLine("JWT Authentication Failed: " + context.Exception?.Message);

            return Task.CompletedTask;
        },
         OnTokenValidated = context =>
        {
            Debug.WriteLine("JWT validated for: " + context.Principal?.Identity?.Name);
            return Task.CompletedTask;
        }
    };

    
});



// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
// }).AddJwtBearer(options =>
// {
    
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuer = true,
//         ValidateAudience = true,
//         ValidateLifetime = true,
//         ValidateIssuerSigningKey = true,
//         ValidIssuer =   builder.Configuration["JwtOptions:Issuer"],
//         ValidAudience = builder.Configuration["JwtOptions:Audience"],
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtOptions:Secret"]!)),
//     };

//     options.Events = new JwtBearerEvents
//     {  

//         OnMessageReceived = context =>
//         {
//             Debug.WriteLine("OnMessageReceived: " + context.Request.Headers["Authorization"]);
//             return Task.CompletedTask;
//         },
//         OnAuthenticationFailed = context =>
//         {
//             Debug.WriteLine("OnAuthenticationFailed: " + context.Exception.Message);
//             return Task.CompletedTask;
//         },
//         OnTokenValidated = context =>
//         {
//             Debug.WriteLine("OnTokenValidated: " + context.SecurityToken);
//             return Task.CompletedTask;
//         }
//     };

// });




builder.Services.AddAuthorization();

// builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<MyDbContext>();







var app = builder.Build();

app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
}

//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();
// app.MapIdentityApi<IdentityUser>();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
