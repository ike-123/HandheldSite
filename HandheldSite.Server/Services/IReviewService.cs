using System;
using HandheldSite.Server.Models;

namespace HandheldSite.Server.Services
{
    public interface IReviewService
    {
        
        Task<List<Review>> GetRandomReviews();

        Task<ReviewWithLikeDto> GetReview(int ReviewId);

        Task<List<ReviewWithLikeDto>> GetReviewsForHandheld(int HandheldIdId, string sort);

        Task<List<Review>> GetReviewsByUser(string userid);

        Task CreateReview(CreateReviewDTO submittedreview, Guid userid);

        Task<bool> FetchLikeStatus(int ReviewId, string userid );

        Task<bool> ToggleLikeStatus(int ReviewId, string userid );

        Task<List<Review>> GetLikedReviews(string userid);
    }
}
