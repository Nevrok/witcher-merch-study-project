using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WitcherMerch.Application.DTOs;
using WitcherMerch.Application.Interfaces;

namespace WitcherMerch.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService) => _productService = productService;

    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductListDto>>> GetProducts([FromQuery] ProductFilterRequest filter)
    {
        var result = await _productService.GetProductsAsync(filter);
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<List<ProductListDto>>> GetFeatured([FromQuery] int count = 8)
    {
        var result = await _productService.GetFeaturedProductsAsync(count);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductDto>> GetBySlug(string slug)
    {
        var product = await _productService.GetProductBySlugAsync(slug);
        if (product is null) return NotFound();
        return Ok(product);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        var categories = await _productService.GetCategoriesAsync();
        return Ok(categories);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductRequest request)
    {
        var product = await _productService.CreateProductAsync(request);
        return CreatedAtAction(nameof(GetBySlug), new { slug = product.Slug }, product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProductDto>> Update(Guid id, [FromBody] UpdateProductRequest request)
    {
        var product = await _productService.UpdateProductAsync(id, request);
        if (product is null) return NotFound();
        return Ok(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var deleted = await _productService.DeleteProductAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
