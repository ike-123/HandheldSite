using System;
using HandheldSite.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HandheldSite.Server.Data
{
    public class MyDbContext: IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {

        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
            
        }

        DbSet<User> Users {get;set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>().Property(u=> u.UserName).HasMaxLength(256);

        }

    }
}
