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

        public DbSet<Review> Reviews {get;set;}

        public DbSet<Handheld> Handhelds {get;set;}

        public DbSet<Like> Likes {get;set;}


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>().Property(u=> u.UserName).HasMaxLength(256);

            builder.Entity<Like>().HasKey(like => new{like.UserId,like.ReviewId});

        }

    }
}
