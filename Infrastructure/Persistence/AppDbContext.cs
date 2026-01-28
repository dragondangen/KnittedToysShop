using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public DbSet<Toy> Toys { get; set; }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Toy>().HasData(
            new Toy { Id = 1, Name = "Вязаный медведь", Description = "Милый медвежонок из шерсти", Price = 500, ImageUrl = "https://example.com/bear.jpg" },
            new Toy { Id = 2, Name = "Вязаный заяц", Description = "Пушистый зайчик", Price = 400, ImageUrl = "https://example.com/bunny.jpg" }
        );
    }
}