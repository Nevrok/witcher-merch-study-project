using WitcherMerch.Application.DTOs;

namespace WitcherMerch.Application.Interfaces;

public interface ICartService
{
    Task<CartDto> GetCartAsync(Guid userId);
    Task<CartItemDto> AddToCartAsync(Guid userId, AddToCartRequest request);
    Task<CartItemDto?> UpdateCartItemAsync(Guid userId, Guid itemId, UpdateCartItemRequest request);
    Task<bool> RemoveCartItemAsync(Guid userId, Guid itemId);
    Task ClearCartAsync(Guid userId);
}
