using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HandheldSite.Server.Data
{
    public class MyDbContext: IdentityDbContext<IdentityUser>
    {

        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
            
        }

    }
}
