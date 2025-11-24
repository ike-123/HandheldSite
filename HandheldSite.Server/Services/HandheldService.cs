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


    }
}
