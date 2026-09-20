using Microsoft.EntityFrameworkCore;
using WitcherMerch.Application.Interfaces;
using WitcherMerch.Domain.Entities;

namespace WitcherMerch.Infrastructure.Data;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── User ──
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.Username).HasMaxLength(50).IsRequired();
            e.Property(u => u.Email).HasMaxLength(200).IsRequired();
            e.Property(u => u.PasswordHash).IsRequired();
        });

        // ── Category ──
        modelBuilder.Entity<Category>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasIndex(c => c.Slug).IsUnique();
            e.Property(c => c.Name).HasMaxLength(100).IsRequired();
            e.Property(c => c.Slug).HasMaxLength(100).IsRequired();
        });

        // ── Product ──
        modelBuilder.Entity<Product>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasIndex(p => p.Slug).IsUnique();
            e.Property(p => p.Name).HasMaxLength(200).IsRequired();
            e.Property(p => p.Slug).HasMaxLength(200).IsRequired();
            e.Property(p => p.Price).HasPrecision(18, 2);
            e.Property(p => p.DiscountPrice).HasPrecision(18, 2);
            e.HasOne(p => p.Category).WithMany(c => c.Products).HasForeignKey(p => p.CategoryId);
        });

        // ── Order ──
        modelBuilder.Entity<Order>(e =>
        {
            e.HasKey(o => o.Id);
            e.HasIndex(o => o.OrderNumber).IsUnique();
            e.Property(o => o.TotalAmount).HasPrecision(18, 2);
            e.Property(o => o.OrderNumber).HasMaxLength(30).IsRequired();
            e.HasOne(o => o.User).WithMany(u => u.Orders).HasForeignKey(o => o.UserId);
        });

        // ── OrderItem ──
        modelBuilder.Entity<OrderItem>(e =>
        {
            e.HasKey(i => i.Id);
            e.Property(i => i.UnitPrice).HasPrecision(18, 2);
            e.HasOne(i => i.Order).WithMany(o => o.Items).HasForeignKey(i => i.OrderId);
            e.HasOne(i => i.Product).WithMany(p => p.OrderItems).HasForeignKey(i => i.ProductId);
        });

        // ── CartItem ──
        modelBuilder.Entity<CartItem>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasIndex(c => new { c.UserId, c.ProductId }).IsUnique();
            e.HasOne(c => c.User).WithMany(u => u.CartItems).HasForeignKey(c => c.UserId);
            e.HasOne(c => c.Product).WithMany(p => p.CartItems).HasForeignKey(c => c.ProductId);
        });

        // ── WishlistItem ──
        modelBuilder.Entity<WishlistItem>(e =>
        {
            e.HasKey(w => w.Id);
            e.HasIndex(w => new { w.UserId, w.ProductId }).IsUnique();
            e.HasOne(w => w.User).WithMany(u => u.WishlistItems).HasForeignKey(w => w.UserId);
            e.HasOne(w => w.Product).WithMany(p => p.WishlistItems).HasForeignKey(w => w.ProductId);
        });
    }
}
