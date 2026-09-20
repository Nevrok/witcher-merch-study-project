using WitcherMerch.Application.DTOs;

namespace WitcherMerch.Application.Interfaces;

public interface IProductService
{
    Task<PagedResult<ProductListDto>> GetProductsAsync(ProductFilterRequest filter);
    Task<ProductDto?> GetProductBySlugAsync(string slug);
    Task<ProductDto?> GetProductByIdAsync(Guid id);
    Task<List<ProductListDto>> GetFeaturedProductsAsync(int count = 8);
    Task<ProductDto> CreateProductAsync(CreateProductRequest request);
    Task<ProductDto?> UpdateProductAsync(Guid id, UpdateProductRequest request);
    Task<bool> DeleteProductAsync(Guid id);
    Task<List<CategoryDto>> GetCategoriesAsync();
}
