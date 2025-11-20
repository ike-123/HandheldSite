using System.Diagnostics;
using HandheldSite.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace HandheldSite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MainController : ControllerBase
    {

        Review Review = new Review{ReviewText = "I love the steam deck. I bought it last week and have been glued to it ever since", PrimaryImage = ""};


        [Authorize]
        [HttpGet("GetReview")]
        public IActionResult GetReview()
        {   
            return Ok(Review);
        }




    }
}
