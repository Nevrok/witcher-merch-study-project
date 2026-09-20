using Microsoft.EntityFrameworkCore;
using WitcherMerch.Domain.Entities;

namespace WitcherMerch.Application.Interfaces;

/// <summary>
/// Abstraction over EF DbContext so Application layer doesn't depend on Infrastructure.
/// </summary>
public interface IAppDbContext
{
    DbSet<User> Users { get; }
    DbSet<Product> Products { get; }
    DbSet<Category> Categories { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<WishlistItem> WishlistItems { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
