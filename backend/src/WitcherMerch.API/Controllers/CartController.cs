using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WitcherMerch.Application.DTOs;
using WitcherMerch.Application.Interfaces;

namespace WitcherMerch.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService) => _cartService = cartService;

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        var cart = await _cartService.GetCartAsync(UserId);
        return Ok(cart);
    }

    [HttpPost]
    public async Task<ActionResult<CartItemDto>> AddToCart([FromBody] AddToCartRequest request)
    {
        var item = await _cartService.AddToCartAsync(UserId, request);
        return Ok(item);
    }

    [HttpPut("{itemId:guid}")]
    public async Task<ActionResult<CartItemDto>> UpdateItem(Guid itemId, [FromBody] UpdateCartItemRequest request)
    {
        var item = await _cartService.UpdateCartItemAsync(UserId, itemId, request);
        if (item is null) return NotFound();
        return Ok(item);
    }

    [HttpDelete("{itemId:guid}")]
    public async Task<ActionResult> RemoveItem(Guid itemId)
    {
        var removed = await _cartService.RemoveCartItemAsync(UserId, itemId);
        if (!removed) return NotFound();
        return NoContent();
    }

    [HttpDelete]
    public async Task<ActionResult> ClearCart()
    {
        await _cartService.ClearCartAsync(UserId);
        return NoContent();
    }
}
