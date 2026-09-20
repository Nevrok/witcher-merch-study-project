using Microsoft.EntityFrameworkCore;
using WitcherMerch.Application.DTOs;
using WitcherMerch.Application.Interfaces;

namespace WitcherMerch.Application.Services;

public class WishlistService : IWishlistService
{
    private readonly IAppDbContext _db;

    public WishlistService(IAppDbContext db) => _db = db;

    public async Task<List<WishlistItemDto>> GetWishlistAsync(Guid userId)
    {
        return await _db.WishlistItems
            .Include(w => w.Product)
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.AddedAt)
            .Select(w => new WishlistItemDto(w.Id, w.ProductId, w.Product.Name, w.Product.ImageUrl,
                w.Product.Price, w.Product.DiscountPrice, w.AddedAt))
            .ToListAsync();
    }

    public async Task<WishlistItemDto> AddToWishlistAsync(Guid userId, Guid productId)
    {
        var existing = await _db.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

        if (existing is not null)
        {
            var p = await _db.Products.FindAsync(productId);
            return new WishlistItemDto(existing.Id, existing.ProductId, p!.Name, p.ImageUrl, p.Price, p.DiscountPrice, existing.AddedAt);
        }

        var item = new Domain.Entities.WishlistItem
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ProductId = productId
        };

        _db.WishlistItems.Add(item);
        await _db.SaveChangesAsync();

        var product = await _db.Products.FindAsync(productId);
        return new WishlistItemDto(item.Id, item.ProductId, product!.Name, product.ImageUrl, product.Price, product.DiscountPrice, item.AddedAt);
    }

    public async Task<bool> RemoveFromWishlistAsync(Guid userId, Guid productId)
    {
        var item = await _db.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
        if (item is null) return false;

        _db.WishlistItems.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsInWishlistAsync(Guid userId, Guid productId)
    {
        return await _db.WishlistItems.AnyAsync(w => w.UserId == userId && w.ProductId == productId);
    }
}
