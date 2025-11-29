using System;
using HandheldSite.Server.Data;
using HandheldSite.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace HandheldSite.Server.Services
{
    public class ProfileService: IProfileService
    {

        private readonly MyDbContext _dbContext;

        public ProfileService(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<object> GetUser(string userid)
        {
            //this will change so we return the profile instead of the user
            User? user =  await _dbContext.Users.FirstOrDefaultAsync(user => user.Id.ToString() == userid);

            var userdetails = new
            {
                user.UserName,
            };

            return  userdetails ;

        }

        public async Task<object> GetUserProfileinfo(string userid)
        {
            User? user =  await _dbContext.Users.FirstOrDefaultAsync(user => user.Id.ToString() == userid);

            // List<Review> reviewresult = await _reviewService.GetReviewsByUser(userid);

            var reviews = await _dbContext.Reviews.Where(review => review.UserId.ToString() == userid).ToListAsync();

            if(reviews == null)
            {
                return null;
            }

            var ProfileInfo = new 
            {
                username = user.UserName,
                reviews,
                userid, user.Id
            };

            return ProfileInfo;

        }

    }
}
