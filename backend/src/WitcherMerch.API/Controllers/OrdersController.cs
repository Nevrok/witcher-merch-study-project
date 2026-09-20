using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WitcherMerch.Application.DTOs;
using WitcherMerch.Application.Interfaces;

namespace WitcherMerch.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService) => _orderService = orderService;

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var order = await _orderService.CreateOrderAsync(UserId, request);
        return CreatedAtAction(nameof(GetOrder), new { orderId = order.Id }, order);
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        var orders = await _orderService.GetUserOrdersAsync(UserId);
        return Ok(orders);
    }

    [HttpGet("{orderId:guid}")]
    public async Task<ActionResult<OrderDto>> GetOrder(Guid orderId)
    {
        var order = await _orderService.GetOrderByIdAsync(UserId, orderId);
        if (order is null) return NotFound();
        return Ok(order);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{orderId:guid}/status")]
    public async Task<ActionResult<OrderDto>> UpdateStatus(Guid orderId, [FromQuery] string status)
    {
        var order = await _orderService.UpdateOrderStatusAsync(orderId, status);
        if (order is null) return NotFound();
        return Ok(order);
    }
}
