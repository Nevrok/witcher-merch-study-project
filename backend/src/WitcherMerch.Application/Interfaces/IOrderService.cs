using WitcherMerch.Application.DTOs;

namespace WitcherMerch.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderRequest request);
    Task<List<OrderDto>> GetUserOrdersAsync(Guid userId);
    Task<OrderDto?> GetOrderByIdAsync(Guid userId, Guid orderId);
    Task<OrderDto?> UpdateOrderStatusAsync(Guid orderId, string status);
}
