using System;
using HandheldSite.Server.Data;
using HandheldSite.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace HandheldSite.Server.Services
{
    public class ProfileService: IProfileService
    {

        private readonly MyDbContext _dbContext;
        private readonly IReviewService _reviewService;

        public ProfileService(MyDbContext dbContext, IReviewService reviewService)
        {
            _dbContext = dbContext;
            _reviewService = reviewService;
        }

        public async Task<object> GetUserProfileinfo(string userid)
        {
            User? user =  await _dbContext.Users.FirstOrDefaultAsync(user => user.Id.ToString() == userid);

            List<Review> reviewresult = await _reviewService.GetReviewsByUser(userid);

            var ProfileInfo = new 
            {
                username = user.UserName,
                reviewresult
            };

            return ProfileInfo;

        }

    }
}
