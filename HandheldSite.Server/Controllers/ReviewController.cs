using System.Data.Common;
using System.Security.Claims;
using System.Threading.Tasks;
using HandheldSite.Server.Models;
using HandheldSite.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace HandheldSite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _ReviewService;

        public ReviewController(IReviewService reviewService)
        {
            _ReviewService = reviewService;
        }

        [HttpGet("GetRandomReviews")]
        public async Task<ActionResult> GetrandomReviews()
        {
            var reviews = await _ReviewService.GetRandomReviews();

            return Ok(reviews);
        }


        [HttpGet("GetReview/{ReviewId}")]
        public async Task<ActionResult> GetReview(int ReviewId)
        {
            var review = await _ReviewService.GetReview(ReviewId);
            
            return Ok(review);
        }

        [HttpGet("GetReviewsForHandheld/{HandheldId}")]
        public async Task<ActionResult> GetReviewsForHanheld(int HandheldId, string sort = "recent")
        {

            var reviews = await _ReviewService.GetReviewsForHandheld(HandheldId, sort);
            
            return Ok(reviews);
        }

        [HttpGet("GetReviewsByUser/{UserId}")]
        public async Task<ActionResult> GetReviewsByUser(string UserId)
        {
            var reviews = await _ReviewService.GetReviewsByUser(UserId);
            
            return Ok(reviews);
        }


        [Authorize]
        [HttpPost("CreateReview")]
        public async Task<ActionResult> CreateReview([FromBody] CreateReviewDTO reviewdto)
        {
            var userid_string = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var userid = Guid.Parse(userid_string!);

            try
            {
                await _ReviewService.CreateReview(reviewdto,userid);
                return Ok("Review Created");
            }
            catch (Exception)
            {
                return BadRequest("Failed to save review.");
            }
           
        }
    }
}
