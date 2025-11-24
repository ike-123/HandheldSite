using System;
using System.Threading.Tasks;
using HandheldSite.Server.Data;
using HandheldSite.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace HandheldSite.Server.Services
{
    public class ReviewService: IReviewService
    {
        private readonly MyDbContext _dbContext;
        
        public ReviewService(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<List<Review>> GetRandomReviews()
        {
            var reviews = await _dbContext.Reviews.OrderBy(r => Guid.NewGuid()).Take(10).ToListAsync();

            if(reviews == null)
            {
                return null;
            }

            return reviews;
        }

           public async Task<Review> GetReview(int ReviewId)
        {
            var review = await _dbContext.Reviews.FirstOrDefaultAsync(review => review.ReviewId == ReviewId);

            if(review == null)
            {
                return null;
            }

            return review;
        }

        public async Task<List<Review>> GetReviewsForHandheld(int HandheldIdId, string sort)
        {
            var query = _dbContext.Reviews.Where(review => review.HandheldId == HandheldIdId);

            if(sort == "recent")
                query = query.OrderByDescending(h => h.CreatedAt)
            ;

            if (sort == "mostlikes")
                // query = query.OrderBy(h => h.);
                ;

            return await query.ToListAsync();

        }

        public async Task<List<Review>> GetReviewsByUser(string userid)
        {
            var reviews = await _dbContext.Reviews.Where(review => review.UserId.ToString() == userid).ToListAsync();

            if(reviews == null)
            {
                return null;
            }

            return reviews;
        }

   
        public async Task CreateReview(CreateReviewDTO submittedreview, Guid userid )
        {



            var Review = new Review
            {
                UserId = userid,
                HandheldId = submittedreview.HandheldId,
                PrimaryImage = submittedreview.PrimaryImage,
                SecondaryImage = submittedreview.SecondaryImage,
                ReviewText = submittedreview.ReviewText,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Reviews.Add(Review);
            await _dbContext.SaveChangesAsync();
        
        }
    }
}
