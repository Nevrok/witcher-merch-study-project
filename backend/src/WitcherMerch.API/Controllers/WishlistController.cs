using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WitcherMerch.Application.DTOs;
using WitcherMerch.Application.Interfaces;

namespace WitcherMerch.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;

    public WishlistController(IWishlistService wishlistService) => _wishlistService = wishlistService;

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<List<WishlistItemDto>>> GetWishlist()
    {
        var items = await _wishlistService.GetWishlistAsync(UserId);
        return Ok(items);
    }

    [HttpPost("{productId:guid}")]
    public async Task<ActionResult<WishlistItemDto>> AddToWishlist(Guid productId)
    {
        var item = await _wishlistService.AddToWishlistAsync(UserId, productId);
        return Ok(item);
    }

    [HttpDelete("{productId:guid}")]
    public async Task<ActionResult> RemoveFromWishlist(Guid productId)
    {
        var removed = await _wishlistService.RemoveFromWishlistAsync(UserId, productId);
        if (!removed) return NotFound();
        return NoContent();
    }

    [HttpGet("{productId:guid}/check")]
    public async Task<ActionResult<bool>> CheckWishlist(Guid productId)
    {
        var isInWishlist = await _wishlistService.IsInWishlistAsync(UserId, productId);
        return Ok(isInWishlist);
    }
}
