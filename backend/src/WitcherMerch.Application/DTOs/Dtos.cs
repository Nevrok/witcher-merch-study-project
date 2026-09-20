namespace WitcherMerch.Application.DTOs;

// ── Auth ──
public record RegisterRequest(string Username, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, string RefreshToken, UserDto User);
public record RefreshTokenRequest(string RefreshToken);

// ── User ──
public record UserDto(Guid Id, string Username, string Email, string Role);

// ── Product ──
public record ProductDto(
    Guid Id, string Name, string Slug, string Description,
    decimal Price, decimal? DiscountPrice,
    string ImageUrl, string? ImageUrl2, string? ImageUrl3,
    int StockQuantity, bool IsFeatured, Guid CategoryId, string CategoryName);

public record ProductListDto(
    Guid Id, string Name, string Slug, decimal Price, decimal? DiscountPrice,
    string ImageUrl, bool IsFeatured, string CategoryName);

public record CreateProductRequest(
    string Name, string Description, decimal Price, decimal? DiscountPrice,
    string ImageUrl, string? ImageUrl2, string? ImageUrl3,
    int StockQuantity, bool IsFeatured, Guid CategoryId);

public record UpdateProductRequest(
    string? Name, string? Description, decimal? Price, decimal? DiscountPrice,
    string? ImageUrl, string? ImageUrl2, string? ImageUrl3,
    int? StockQuantity, bool? IsFeatured, Guid? CategoryId);

// ── Category ──
public record CategoryDto(Guid Id, string Name, string Slug, string? Description, string? ImageUrl, int ProductCount);

// ── Cart ──
public record CartItemDto(Guid Id, Guid ProductId, string ProductName, string ProductImage, decimal Price, decimal? DiscountPrice, int Quantity);
public record AddToCartRequest(Guid ProductId, int Quantity = 1);
public record UpdateCartItemRequest(int Quantity);
public record CartDto(List<CartItemDto> Items, decimal Total);

// ── Wishlist ──
public record WishlistItemDto(Guid Id, Guid ProductId, string ProductName, string ProductImage, decimal Price, decimal? DiscountPrice, DateTime AddedAt);

// ── Order ──
public record OrderDto(
    Guid Id, string OrderNumber, decimal TotalAmount, string Status,
    string ShippingAddress, string ShippingCity, string ShippingZip, string ContactPhone,
    DateTime CreatedAt, List<OrderItemDto> Items);

public record OrderItemDto(Guid Id, Guid ProductId, string ProductName, string ProductImage, int Quantity, decimal UnitPrice);

public record CreateOrderRequest(string ShippingAddress, string ShippingCity, string ShippingZip, string ContactPhone);

// ── Pagination ──
public record PagedResult<T>(List<T> Items, int TotalCount, int Page, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}

public record ProductFilterRequest
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 12;
    public string? Search { get; init; }
    public Guid? CategoryId { get; init; }
    public string? SortBy { get; init; } // price_asc, price_desc, name, newest
    public bool? IsFeatured { get; init; }
}
