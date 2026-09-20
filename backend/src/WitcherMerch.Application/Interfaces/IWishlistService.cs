using WitcherMerch.Application.DTOs;

namespace WitcherMerch.Application.Interfaces;

public interface IWishlistService
{
    Task<List<WishlistItemDto>> GetWishlistAsync(Guid userId);
    Task<WishlistItemDto> AddToWishlistAsync(Guid userId, Guid productId);
    Task<bool> RemoveFromWishlistAsync(Guid userId, Guid productId);
    Task<bool> IsInWishlistAsync(Guid userId, Guid productId);
}
