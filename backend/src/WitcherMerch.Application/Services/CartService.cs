using Microsoft.EntityFrameworkCore;
using WitcherMerch.Application.DTOs;
using WitcherMerch.Application.Interfaces;

namespace WitcherMerch.Application.Services;

public class CartService : ICartService
{
    private readonly IAppDbContext _db;

    public CartService(IAppDbContext db) => _db = db;

    public async Task<CartDto> GetCartAsync(Guid userId)
    {
        var items = await _db.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .Select(c => new CartItemDto(c.Id, c.ProductId, c.Product.Name, c.Product.ImageUrl,
                c.Product.Price, c.Product.DiscountPrice, c.Quantity))
            .ToListAsync();

        var total = items.Sum(i => (i.DiscountPrice ?? i.Price) * i.Quantity);
        return new CartDto(items, total);
    }

    public async Task<CartItemDto> AddToCartAsync(Guid userId, AddToCartRequest request)
    {
        var existing = await _db.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == request.ProductId);

        if (existing is not null)
        {
            existing.Quantity += request.Quantity;
            await _db.SaveChangesAsync();
        }
        else
        {
            existing = new Domain.Entities.CartItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };
            _db.CartItems.Add(existing);
            await _db.SaveChangesAsync();
        }

        var product = await _db.Products.FindAsync(request.ProductId);
        return new CartItemDto(existing.Id, existing.ProductId, product!.Name, product.ImageUrl,
            product.Price, product.DiscountPrice, existing.Quantity);
    }

    public async Task<CartItemDto?> UpdateCartItemAsync(Guid userId, Guid itemId, UpdateCartItemRequest request)
    {
        var item = await _db.CartItems.Include(c => c.Product)
            .FirstOrDefaultAsync(c => c.Id == itemId && c.UserId == userId);
        if (item is null) return null;

        item.Quantity = request.Quantity;
        await _db.SaveChangesAsync();

        return new CartItemDto(item.Id, item.ProductId, item.Product.Name, item.Product.ImageUrl,
            item.Product.Price, item.Product.DiscountPrice, item.Quantity);
    }

    public async Task<bool> RemoveCartItemAsync(Guid userId, Guid itemId)
    {
        var item = await _db.CartItems.FirstOrDefaultAsync(c => c.Id == itemId && c.UserId == userId);
        if (item is null) return false;
        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task ClearCartAsync(Guid userId)
    {
        var items = await _db.CartItems.Where(c => c.UserId == userId).ToListAsync();
        _db.CartItems.RemoveRange(items);
        await _db.SaveChangesAsync();
    }
}
