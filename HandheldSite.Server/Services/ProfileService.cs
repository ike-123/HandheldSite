using System;
using HandheldSite.Server.Data;
using HandheldSite.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace HandheldSite.Server.Services
{
    public class ProfileService : IProfileService
    {

        private readonly MyDbContext _dbContext;

        public ProfileService(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<object> GetUser(string userid)
        {
            //this will change so we return the profile instead of the user
            User? user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id.ToString() == userid);

            var userdetails = new
            {
                user.UserName,
                user.ProfileImage
            };

            return userdetails;

        }

        public async Task<object> GetUserProfileinfo(string userid)
        {
            User? user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id.ToString() == userid);

            // List<Review> reviewresult = await _reviewService.GetReviewsByUser(userid);

            var reviews = await _dbContext.Reviews.Where(review => review.UserId.ToString() == userid).ToListAsync();

            if (reviews == null)
            {
                return null;
            }

            var ProfileInfo = new
            {
                username = user.UserName,
                reviews,
                user.Id,
                user.ProfileImage
            };

            return ProfileInfo;

        }

        public async Task ChangeUserProfile(UpdateProfileDTO UpdatedProfileDTO, string userid)
        {
            User? user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id.ToString() == userid);

            byte[]? imageBytes = null;

            if (UpdatedProfileDTO.ProfileImage != null)
            {
                using (var ms = new MemoryStream())
                {
                    await UpdatedProfileDTO.ProfileImage.CopyToAsync(ms);
                    imageBytes = ms.ToArray();
                }
            }

             // Update username if provided
            if (!string.IsNullOrWhiteSpace(UpdatedProfileDTO.username))
            {
                user.UserName = UpdatedProfileDTO.username;
            }

                // Update profile image
            if (UpdatedProfileDTO.ProfileImage != null)
            {
                using var ms = new MemoryStream();
                await UpdatedProfileDTO.ProfileImage.CopyToAsync(ms);
                user.ProfileImage = ms.ToArray();
            }
            await _dbContext.SaveChangesAsync();


        }

    }
}
