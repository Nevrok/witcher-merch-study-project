using Microsoft.EntityFrameworkCore;
using WitcherMerch.Application.DTOs;
using WitcherMerch.Application.Interfaces;
using WitcherMerch.Domain.Entities;

namespace WitcherMerch.Application.Services;

public class ProductService : IProductService
{
    private readonly IAppDbContext _db;

    public ProductService(IAppDbContext db) => _db = db;

    public async Task<PagedResult<ProductListDto>> GetProductsAsync(ProductFilterRequest filter)
    {
        var query = _db.Products.Include(p => p.Category).AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
            query = query.Where(p => p.Name.ToLower().Contains(filter.Search.ToLower())
                                  || p.Description.ToLower().Contains(filter.Search.ToLower()));

        if (filter.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == filter.CategoryId.Value);

        if (filter.IsFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == filter.IsFeatured.Value);

        query = filter.SortBy switch
        {
            "price_asc" => query.OrderBy(p => p.DiscountPrice ?? p.Price),
            "price_desc" => query.OrderByDescending(p => p.DiscountPrice ?? p.Price),
            "name" => query.OrderBy(p => p.Name),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(p => new ProductListDto(p.Id, p.Name, p.Slug, p.Price, p.DiscountPrice, p.ImageUrl, p.IsFeatured, p.Category.Name))
            .ToListAsync();

        return new PagedResult<ProductListDto>(items, totalCount, filter.Page, filter.PageSize);
    }

    public async Task<ProductDto?> GetProductBySlugAsync(string slug)
    {
        var p = await _db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Slug == slug);
        return p is null ? null : MapToDto(p);
    }

    public async Task<ProductDto?> GetProductByIdAsync(Guid id)
    {
        var p = await _db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);
        return p is null ? null : MapToDto(p);
    }

    public async Task<List<ProductListDto>> GetFeaturedProductsAsync(int count = 8)
    {
        return await _db.Products
            .Include(p => p.Category)
            .Where(p => p.IsFeatured)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .Select(p => new ProductListDto(p.Id, p.Name, p.Slug, p.Price, p.DiscountPrice, p.ImageUrl, p.IsFeatured, p.Category.Name))
            .ToListAsync();
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductRequest request)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Slug = GenerateSlug(request.Name),
            Description = request.Description,
            Price = request.Price,
            DiscountPrice = request.DiscountPrice,
            ImageUrl = request.ImageUrl,
            ImageUrl2 = request.ImageUrl2,
            ImageUrl3 = request.ImageUrl3,
            StockQuantity = request.StockQuantity,
            IsFeatured = request.IsFeatured,
            CategoryId = request.CategoryId
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return (await GetProductByIdAsync(product.Id))!;
    }

    public async Task<ProductDto?> UpdateProductAsync(Guid id, UpdateProductRequest request)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return null;

        if (request.Name is not null) { product.Name = request.Name; product.Slug = GenerateSlug(request.Name); }
        if (request.Description is not null) product.Description = request.Description;
        if (request.Price.HasValue) product.Price = request.Price.Value;
        if (request.DiscountPrice.HasValue) product.DiscountPrice = request.DiscountPrice.Value;
        if (request.ImageUrl is not null) product.ImageUrl = request.ImageUrl;
        if (request.ImageUrl2 is not null) product.ImageUrl2 = request.ImageUrl2;
        if (request.ImageUrl3 is not null) product.ImageUrl3 = request.ImageUrl3;
        if (request.StockQuantity.HasValue) product.StockQuantity = request.StockQuantity.Value;
        if (request.IsFeatured.HasValue) product.IsFeatured = request.IsFeatured.Value;
        if (request.CategoryId.HasValue) product.CategoryId = request.CategoryId.Value;

        await _db.SaveChangesAsync();
        return (await GetProductByIdAsync(id))!;
    }

    public async Task<bool> DeleteProductAsync(Guid id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return false;
        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<CategoryDto>> GetCategoriesAsync()
    {
        return await _db.Categories
            .Select(c => new CategoryDto(c.Id, c.Name, c.Slug, c.Description, c.ImageUrl, c.Products.Count))
            .ToListAsync();
    }

    private static ProductDto MapToDto(Product p) => new(
        p.Id, p.Name, p.Slug, p.Description, p.Price, p.DiscountPrice,
        p.ImageUrl, p.ImageUrl2, p.ImageUrl3, p.StockQuantity, p.IsFeatured,
        p.CategoryId, p.Category.Name);

    private static string GenerateSlug(string name) =>
        System.Text.RegularExpressions.Regex.Replace(name.ToLower().Trim(), @"[^a-z0-9]+", "-").Trim('-');
}
