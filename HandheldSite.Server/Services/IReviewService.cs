using System;
using HandheldSite.Server.Models;

namespace HandheldSite.Server.Services
{
    public interface IReviewService
    {
        
        Task<List<Review>> GetRandomReviews();

        Task<ReviewWithLikeDto> GetReview(int ReviewId,string userid);

        Task<List<ReviewWithLikeDto>> GetReviewsForHandheld(int HandheldIdId, string sort,string userid);

        Task<List<ReviewWithLikeDto>> GetReviewsByUser(string userid, string MyUserId);

        Task CreateReview(CreateReviewDTO submittedreview, Guid userid);

        Task<bool> FetchLikeStatus(int ReviewId, string userid );

        Task<object?> ToggleLikeStatus(int ReviewId, string userid );

        Task<List<ReviewWithLikeDto>> GetLikedReviews(string userid);
    }
}
