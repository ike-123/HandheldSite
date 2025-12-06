using System;
using HandheldSite.Server.Data;
using HandheldSite.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace HandheldSite.Server.Services
{
    public class HandheldService: IHandheldService
    {
        private readonly MyDbContext _dbContext;
        
        public HandheldService(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<List<Handheld>> GetAllHandhelds()
        {
            var Handhelds =  await _dbContext.Handhelds.ToListAsync();


            if(Handhelds == null)
            {
                return null;
            }

            return Handhelds;
        }

        public async Task CreateHandheld(CreateHandheldDTO _submittedHandheld)
        {
            
            var NewHandheld = new Handheld();

                // Update profile image
            if (_submittedHandheld.HandheldImg != null)
            {
                using var ms = new MemoryStream();
                await _submittedHandheld.HandheldImg.CopyToAsync(ms);
                NewHandheld.HandheldImg = ms.ToArray();
            }
            NewHandheld.HandheldName = _submittedHandheld.HandheldName;
            NewHandheld.Description = _submittedHandheld.Description;
            NewHandheld.Processor = _submittedHandheld.Processor;
            NewHandheld.CPU = _submittedHandheld.CPU;
            NewHandheld.GPU = _submittedHandheld.GPU;
            NewHandheld.RAM = _submittedHandheld.RAM;
            NewHandheld.Display = _submittedHandheld.Display;
            NewHandheld.Battery = _submittedHandheld.Battery;


            _dbContext.Handhelds.Add(NewHandheld);
            await _dbContext.SaveChangesAsync();
            
        }


    }
}
