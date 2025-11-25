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
        private readonly IProfileService _profileService;

        public ReviewService(MyDbContext dbContext, IProfileService profileService)
        {
            _dbContext = dbContext;
            _profileService = profileService;
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

           public async Task<ReviewWithLikeDto> GetReview(int ReviewId)
        {
            //take the reviewID and find the review
            //then add isliked and the user profile.

            var review = await _dbContext.Reviews.FirstOrDefaultAsync(review => review.ReviewId == ReviewId);

            if(review == null)
            {
                return null;
            }

            var result = new ReviewWithLikeDto
            {
                ReviewId = review.ReviewId,
                UserId = review.UserId,
                HandheldId = review.HandheldId,
                ReviewText = review.ReviewText,
                PrimaryImage = review.PrimaryImage,
                SecondaryImage = review.SecondaryImage,
                CreatedAt = review.CreatedAt,
                isLiked = await FetchLikeStatus(review.ReviewId,review.UserId.ToString()),
                user = await _profileService.GetUser(review.UserId.ToString())
            };


            return result;
        }

        public async Task<List<ReviewWithLikeDto>> GetReviewsForHandheld(int HandheldIdId, string sort)
        {
            var query = _dbContext.Reviews.Where(review => review.HandheldId == HandheldIdId);

            if(sort == "recent")
                query = query.OrderByDescending(h => h.CreatedAt)
            ;

            if (sort == "mostlikes")
                
                query = query.OrderByDescending(review => _dbContext.Likes.Count(like=> like.ReviewId == review.ReviewId));



            var reviews = await query.ToListAsync();


            var result =  await Task.WhenAll( reviews.Select(async review => new ReviewWithLikeDto
            {
                ReviewId = review.ReviewId,
                UserId = review.UserId,
                HandheldId = review.HandheldId,
                ReviewText = review.ReviewText,
                PrimaryImage = review.PrimaryImage,
                SecondaryImage = review.SecondaryImage,
                CreatedAt = review.CreatedAt,
                isLiked = await FetchLikeStatus(review.ReviewId,review.UserId.ToString()),
                user = await _profileService.GetUser(review.UserId.ToString())
            }));

            // var result =  reviews.Select(async review => new ReviewWithLikeDto
            // {
            //     ReviewId = review.ReviewId,
            //     UserId = review.UserId,
            //     HandheldId = review.HandheldId,
            //     ReviewText = review.ReviewText,
            //     PrimaryImage = review.PrimaryImage,
            //     SecondaryImage = review.SecondaryImage,
            //     CreatedAt = review.CreatedAt,
            //     isLiked = await FetchLikeStatus(review.ReviewId,review.UserId.ToString())
            // });
            

            return result.ToList();

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


        //Fetch Like Status

        public async Task<bool> FetchLikeStatus(int ReviewId, string userid )
        {

            var isLiked = await _dbContext.Likes.FirstOrDefaultAsync(like => like.ReviewId ==  ReviewId && like.UserId.ToString() == userid);

            return isLiked != null;

        }



        //Toggle like


        public async Task<bool> ToggleLikeStatus(int ReviewId, string userid )
        {

            Guid userIdGuid = Guid.Parse(userid);

            Like? isLiked = await _dbContext.Likes.FirstOrDefaultAsync(like => like.ReviewId ==  ReviewId && like.UserId == userIdGuid);

            if(isLiked == null)
            {
                //The user hasn't liked the review. So we will Like it.

                var Like = new Like();

                Like.UserId = userIdGuid;
                Like.ReviewId = ReviewId; 

                await _dbContext.Likes.AddAsync(Like);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            //The user has currently favourited the game. So we will unfavourite it by removing it from the database.

            _dbContext.Likes.Remove(isLiked);
            await _dbContext.SaveChangesAsync();

            return false;
        }



        //Fetch All Likes

        public async Task<List<Review>> GetLikedReviews(string userid)
        {

            Guid userIdGuid = Guid.Parse(userid);

            //For each review in the reviews table we look at a like and check if the like.reviewid is the same as the review.reviewid,
            //  if it's the same then we know a user has liked it. We then check the like.userid and see if it matches the userid that we passed 
            
            //shorter explanation- A review is included if there exists a Like with the same ReviewId and the Like.UserId equals userIdGuid.

            return await _dbContext.Reviews.Where(review => _dbContext.Likes.Any(like => like.ReviewId == review.ReviewId && like.UserId == userIdGuid)).ToListAsync();

        }


    }
}
