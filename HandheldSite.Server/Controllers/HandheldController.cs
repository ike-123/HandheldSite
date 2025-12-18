using HandheldSite.Server.Models;
using HandheldSite.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HandheldSite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HandheldController : ControllerBase
    {
        private readonly IHandheldService _handheldService;


        public HandheldController(IHandheldService handheldService)
        {
            _handheldService = handheldService;
        }
        
        [HttpGet("GetAllHandhelds")]
        public async Task<ActionResult> GetAllHandhelds()
        {
            var Handhelds = await _handheldService.GetAllHandhelds();

            if(Handhelds == null)
            {
                return BadRequest("No Handhelds found");
            }
            
            return Ok(Handhelds);
        }

        [HttpPost("CreateHandheld")]
        public async Task<ActionResult> CreateHandheld([FromForm] CreateHandheldDTO handheld)
        {
            if (handheld == null)
            {
                return BadRequest("provided Handheld is Null.");
            }

            try
            {
                await _handheldService.CreateHandheld(handheld);
                return Ok("Handheld Created");
            }
            catch (Exception)
            {
                return BadRequest("Failed to Upload Handheld.");
            }
        }



    }
}
