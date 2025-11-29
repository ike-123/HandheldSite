using System;
using System.Threading.Tasks;
using HandheldSite.Server.Data;
using HandheldSite.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace HandheldSite.Server.Services
{
    public class ReviewService : IReviewService
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

            if (reviews == null)
            {
                return null;
            }

            return reviews;
        }

        public async Task<ReviewWithLikeDto> GetReview(int ReviewId, string userid)
        {
            //take the reviewID and find the review
            //then add isliked and the user profile.

            var review = await _dbContext.Reviews.FirstOrDefaultAsync(review => review.ReviewId == ReviewId);

            if (review == null)
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
                CreatedAt = review.CreatedAt,
                LikeCount = review.LikeCount,
                isLiked = await FetchLikeStatus(review.ReviewId, userid),
                user = await _profileService.GetUser(review.UserId.ToString())
            };


            return result;
        }

        public async Task<List<ReviewWithLikeDto>> GetReviewsForHandheld(int HandheldIdId, string sort, string userid)
        {
            var query = _dbContext.Reviews.Where(review => review.HandheldId == HandheldIdId);

            if (sort == "recent")
                query = query.OrderByDescending(h => h.CreatedAt)
            ;

            if (sort == "mostlikes")

                query = query.OrderByDescending(review => _dbContext.Likes.Count(like => like.ReviewId == review.ReviewId));


            var reviews = await query.ToListAsync();


            // Get all reviewIds we are working with
            var reviewIds = reviews.Select(review => review.ReviewId).ToList();


            // Collect all user IDs (authors) for each review
            var userIds = reviews.Select(review => review.UserId).Distinct().ToList();


            // Fetch which of these reviews are liked by the current user
            var likedReviewIds = await _dbContext.Likes.Where(like => reviewIds.Contains(like.ReviewId) && like.UserId.ToString() == userid).Select(like => like.ReviewId).ToListAsync();



            // Batch load all users
            var users = await _dbContext.Users.Where(u => userIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id, u => new { u.Email, u.UserName, u.Id });


            var result = await Task.WhenAll(reviews.Select(async review => new ReviewWithLikeDto
            {
                ReviewId = review.ReviewId,
                HandheldId = review.HandheldId,
                ReviewText = review.ReviewText,
                PrimaryImage = review.PrimaryImage,
                CreatedAt = review.CreatedAt,
                LikeCount = review.LikeCount,
                isLiked = likedReviewIds.Contains(review.ReviewId),
                user = users[review.UserId]
            }));


            // var result =  await Task.WhenAll( reviews.Select(async review => new ReviewWithLikeDto
            // {
            //     ReviewId = review.ReviewId,
            //     UserId = review.UserId,
            //     HandheldId = review.HandheldId,
            //     ReviewText = review.ReviewText,
            //     PrimaryImage = review.PrimaryImage,
            //     SecondaryImage = review.SecondaryImage,
            //     CreatedAt = review.CreatedAt,
            //     isLiked = await FetchLikeStatus(review.ReviewId,review.UserId.ToString()),
            //     user = await _profileService.GetUser(review.UserId.ToString())
            // }));

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

        public async Task<List<ReviewWithLikeDto>> GetReviewsByUser(string userid, string myuserId)
        {

            var query = _dbContext.Reviews.Where(review => review.UserId.ToString() == userid);

            query = query.OrderByDescending(h => h.CreatedAt);


            var reviews = await query.ToListAsync();

            if (reviews == null)
            {
                return null;
            }


            // Get all reviewIds we are working with
            var reviewIds = reviews.Select(review => review.ReviewId).ToList();


            // Collect all user IDs (authors) for each review
            var userIds = reviews.Select(review => review.UserId).Distinct().ToList();


            // Fetch which of these reviews are liked by the current user
            var likedReviewIds = await _dbContext.Likes.Where(like => reviewIds.Contains(like.ReviewId) && like.UserId.ToString() == myuserId).Select(like => like.ReviewId).ToListAsync();



            // Batch load all users
            var users = await _dbContext.Users.Where(u => userIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id, u => new { u.Email, u.UserName, u.Id });


            var result = await Task.WhenAll(reviews.Select(async review => new ReviewWithLikeDto
            {
                ReviewId = review.ReviewId,
                HandheldId = review.HandheldId,
                ReviewText = review.ReviewText,
                PrimaryImage = review.PrimaryImage,
                CreatedAt = review.CreatedAt,
                LikeCount = review.LikeCount,
                isLiked = likedReviewIds.Contains(review.ReviewId),
                user = users[review.UserId]
            }));

            return result.ToList();
        }


        public async Task<bool> CreateReview(CreateReviewDTO submittedReview, Guid userid)
        {

            byte[]? imageBytes = null;

            if (submittedReview.PrimaryImage != null)
            {
                using (var ms = new MemoryStream())
                {
                    await submittedReview.PrimaryImage.CopyToAsync(ms);
                    imageBytes = ms.ToArray();
                }
            }



            if (int.TryParse(submittedReview.HandheldId, out int intID))
            {
                var Review = new Review
                {
                    UserId = userid,
                    HandheldId = intID,
                    PrimaryImage = imageBytes,
                    ReviewText = submittedReview.ReviewText,
                    LikeCount = 0,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Reviews.Add(Review);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            else
            {
                return false;
            }



        }


        //Fetch Like Status

        public async Task<bool> FetchLikeStatus(int ReviewId, string userid)
        {

            var isLiked = await _dbContext.Likes.FirstOrDefaultAsync(like => like.ReviewId == ReviewId && like.UserId.ToString() == userid);

            return isLiked != null;

        }



        //Toggle like


        public async Task<object?> ToggleLikeStatus(int ReviewId, string userid)
        {

            Guid userIdGuid = Guid.Parse(userid);

            //check if user has liked review
            Like? isLiked = await _dbContext.Likes.FirstOrDefaultAsync(like => like.ReviewId == ReviewId && like.UserId == userIdGuid);

            //get the review and return null if it doesn't exist
            var review = await _dbContext.Reviews.FirstOrDefaultAsync(review => review.ReviewId == ReviewId);
            if (review == null)
            {
                return null;
            }

            if (isLiked == null)
            {
                //The user hasn't liked the review. So we will Like it.

                //add the like into the like table
                var Like = new Like();

                Like.UserId = userIdGuid;
                Like.ReviewId = ReviewId;

                var Result = new
                {
                    likecount = review.LikeCount + 1,
                    likestatus = true,

                };

                //increase the likecount in the review by 1
                review.LikeCount += 1;

                await _dbContext.Likes.AddAsync(Like);
                await _dbContext.SaveChangesAsync();


                return Result;
            }

            //The user has currently favourited the game. So we will unfavourite it by removing it from the database.

            _dbContext.Likes.Remove(isLiked);

            var Result2 = new
            {
                likecount = review.LikeCount - 1,
                likestatus = false,
            };

            review.LikeCount -= 1;



            await _dbContext.SaveChangesAsync();

            return Result2;
        }



        //Fetch All Likes

        public async Task<List<ReviewWithLikeDto>> GetLikedReviews(string userid)
        {

            Guid userIdGuid = Guid.Parse(userid);

            //For each review in the reviews table we look at a like and check if the like.reviewid is the same as the review.reviewid,
            //  if it's the same then we know a user has liked it. We then check the like.userid and see if it matches the userid that we passed 

            //shorter explanation- A review is included if there exists a Like with the same ReviewId and the Like.UserId equals userIdGuid.

            var reviews = await _dbContext.Reviews.Where(review => _dbContext.Likes.Any(like => like.ReviewId == review.ReviewId && like.UserId == userIdGuid)).ToListAsync();


            // Get all reviewIds we are working with
            var reviewIds = reviews.Select(review => review.ReviewId).ToList();


            // Collect all user IDs (authors) for each review
            var userIds = reviews.Select(review => review.UserId).Distinct().ToList();


            // Fetch which of these reviews are liked by the current user
            var likedReviewIds = await _dbContext.Likes.Where(like => reviewIds.Contains(like.ReviewId) && like.UserId.ToString() == userid).Select(like => like.ReviewId).ToListAsync();



            // Batch load all users
            var users = await _dbContext.Users.Where(u => userIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id, u => new { u.Email, u.UserName,u.Id });


            var result = await Task.WhenAll(reviews.Select(async review => new ReviewWithLikeDto
            {
                ReviewId = review.ReviewId,
                HandheldId = review.HandheldId,
                ReviewText = review.ReviewText,
                PrimaryImage = review.PrimaryImage,
                CreatedAt = review.CreatedAt,
                LikeCount = review.LikeCount,
                isLiked = likedReviewIds.Contains(review.ReviewId),
                user = users[review.UserId]
            }));

            return result.ToList();



        }


    }
}
