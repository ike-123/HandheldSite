using System;
using HandheldSite.Server.Models;

namespace HandheldSite.Server.Services
{
    public interface IReviewService
    {
        
        Task<List<Review>> GetRandomReviews();

        Task<Review> GetReview(int ReviewId);

        Task<List<Review>> GetReviewsForHandheld(int HandheldIdId);

        Task<List<Review>> GetReviewsByUser(string userid);

        Task CreateReview(CreateReviewDTO submittedreview, Guid userid);
    }
}
