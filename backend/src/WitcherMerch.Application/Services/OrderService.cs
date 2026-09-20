using Microsoft.EntityFrameworkCore;
using WitcherMerch.Application.DTOs;
using WitcherMerch.Application.Interfaces;
using WitcherMerch.Domain.Entities;
using WitcherMerch.Domain.Enums;

namespace WitcherMerch.Application.Services;

public class OrderService : IOrderService
{
    private readonly IAppDbContext _db;
    private readonly ICartService _cartService;

    public OrderService(IAppDbContext db, ICartService cartService)
    {
        _db = db;
        _cartService = cartService;
    }

    public async Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderRequest request)
    {
        var cart = await _cartService.GetCartAsync(userId);
        if (cart.Items.Count == 0)
            throw new InvalidOperationException("Cart is empty");

        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderNumber = $"WM-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}",
            UserId = userId,
            ShippingAddress = request.ShippingAddress,
            ShippingCity = request.ShippingCity,
            ShippingZip = request.ShippingZip,
            ContactPhone = request.ContactPhone,
            Status = OrderStatus.Pending
        };

        decimal total = 0;
        foreach (var cartItem in cart.Items)
        {
            var unitPrice = cartItem.DiscountPrice ?? cartItem.Price;
            order.Items.Add(new OrderItem
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                UnitPrice = unitPrice
            });
            total += unitPrice * cartItem.Quantity;

            // Decrease stock
            var product = await _db.Products.FindAsync(cartItem.ProductId);
            if (product is not null)
                product.StockQuantity -= cartItem.Quantity;
        }

        order.TotalAmount = total;
        _db.Orders.Add(order);
        await _cartService.ClearCartAsync(userId);
        await _db.SaveChangesAsync();

        return (await GetOrderByIdAsync(userId, order.Id))!;
    }

    public async Task<List<OrderDto>> GetUserOrdersAsync(Guid userId)
    {
        return await _db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => MapToDto(o))
            .ToListAsync();
    }

    public async Task<OrderDto?> GetOrderByIdAsync(Guid userId, Guid orderId)
    {
        var order = await _db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        return order is null ? null : MapToDto(order);
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(Guid orderId, string status)
    {
        var order = await _db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);
        if (order is null) return null;

        if (Enum.TryParse<OrderStatus>(status, true, out var parsed))
        {
            order.Status = parsed;
            order.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        return MapToDto(order);
    }

    private static OrderDto MapToDto(Order o) => new(
        o.Id, o.OrderNumber, o.TotalAmount, o.Status.ToString(),
        o.ShippingAddress, o.ShippingCity, o.ShippingZip, o.ContactPhone,
        o.CreatedAt,
        o.Items.Select(i => new OrderItemDto(i.Id, i.ProductId, i.Product.Name, i.Product.ImageUrl, i.Quantity, i.UnitPrice)).ToList());
}
